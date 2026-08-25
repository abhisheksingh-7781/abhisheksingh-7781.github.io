# Portfolio API

Backend for the portfolio site. It exists to make the contact form real: it
validates submissions, stores them, emails them on, and refuses them clearly
when it cannot do either.

Built with Express, TypeScript, Mongoose and Nodemailer.

## Why it is a separate service

The site itself is a Next.js **static export** (`output: 'export'`) published to
GitHub Pages, which serves files and runs no server code. Next.js API routes
cannot run there. Keeping the API separate leaves that deployment untouched —
the frontend just posts to this service's URL.

## Endpoints

| Method | Path                    | Auth        | Purpose                                  |
| ------ | ----------------------- | ----------- | ---------------------------------------- |
| `GET`  | `/api`                  | –           | Endpoint listing.                        |
| `GET`  | `/api/health`           | –           | Health and which subsystems are wired up. |
| `POST` | `/api/contact`          | –           | Submit a contact message.                 |
| `GET`  | `/api/contact/messages` | `x-api-key` | List stored messages, newest first.       |

### `POST /api/contact`

```json
{ "name": "Priya Raman", "email": "priya@example.com", "message": "At least 20 characters." }
```

Responses:

| Status | Meaning                                                                       |
| ------ | ----------------------------------------------------------------------------- |
| `201`  | Stored and/or emailed.                                                        |
| `202`  | Honeypot triggered. Silently discarded; the client is told nothing.           |
| `400`  | Validation failed. `error.details.fields` maps each field to its message.     |
| `413`  | Body over 32 kB.                                                              |
| `429`  | Rate limit hit for this IP.                                                   |
| `503`  | Nowhere to put the message — no email sent and nothing stored.                |

Errors share one shape:

```json
{ "ok": false, "error": { "code": "BAD_REQUEST", "message": "...", "details": { "fields": {} } } }
```

## Running it

```bash
npm --prefix server install
cp server/.env.example server/.env
npm --prefix server run dev
```

Then point the frontend at it by copying `.env.local.example` to `.env.local`
in the project root (it already contains `NEXT_PUBLIC_API_URL=http://localhost:4000`)
and running `npm run dev`. The form's badge changes from "Backend not connected"
to "Connected".

Scripts: `dev` (watch), `build` (compile to `dist/`), `start` (run compiled),
`typecheck`.

## Configuration

Every variable is documented in [.env.example](.env.example). The two that
matter most:

- **`CORS_ORIGINS`** — comma-separated browser origins allowed to call the API.
  The deployed site's origin must be listed or the form gets a 403.
- **`TRUST_PROXY`** — set to `1` behind Render/Railway/Fly/Nginx. Left at `0`
  there, every request looks like it came from the proxy and rate limiting
  applies to all visitors as a single bucket.

Email (SMTP) and storage (MongoDB) are **independent and both optional**:

| SMTP | MongoDB | Behaviour                                              |
| ---- | ------- | ------------------------------------------------------ |
| ✓    | ✓       | Stored, then emailed. Delivery outcome saved on record. |
| ✓    | ✗       | Emailed only.                                          |
| ✗    | ✓       | Stored only; read later via `/api/contact/messages`.    |
| ✗    | ✗       | `POST /api/contact` returns `503`.                      |

Configure at least one, or the form cannot accept anything. That last row is
deliberate: the API never returns success for a message it did not keep.

For Gmail, `SMTP_PASSWORD` must be an
[App Password](https://support.google.com/accounts/answer/185833), not the
account password.

## How a submission is handled

1. Rate limit checked (default 5 per IP per 15 minutes).
2. Body validated with the same rules the form applies client-side.
3. Honeypot checked — a filled `company` field returns `202` and stops.
4. **Stored first**, so the message survives an SMTP outage.
5. Emailed, with `Reply-To` set to the sender so replying reaches them.
6. Delivery outcome written back to the stored record.

`From` stays on a domain the SMTP account may send as; putting the visitor's
address there would fail SPF and land the mail in spam.

Stored IPs are SHA-256 hashed and truncated — enough to spot one address
flooding the form, without retaining identifying data about ordinary visitors.

## Deploying

Two shapes are supported, and the same `src/` serves both.

### Vercel (serverless)

[api/index.ts](api/index.ts) is the entry: Vercel calls a handler per request
rather than running `src/index.ts`, so there is no `app.listen()`. The Express
app is built once at module scope and reused by warm invocations, and
[vercel.json](vercel.json) rewrites every path to it.

Set the **Root Directory** to `server` in the project settings, then add the
environment variables from [.env.example](.env.example) in the dashboard.
`TRUST_PROXY` must be `1`.

Two things behave differently here than on a long-running host:

- **Rate limiting is best-effort.** The limiter counts in memory, and each
  serverless instance has its own. Under concurrency the effective limit is
  higher than `CONTACT_RATE_LIMIT_MAX`. Validation, the honeypot and the body
  cap are unaffected. A shared store (Redis or MongoDB) fixes it if the form
  ever attracts real abuse.
- **MongoDB connects lazily**, on the first request of a cold instance, and the
  attempt is memoised so concurrent requests share one connection instead of
  each opening their own.

### Render / Docker (long-running)

A [render.yaml](render.yaml) blueprint and a [Dockerfile](Dockerfile) are
included. On Render, choose **New > Blueprint** and point it at this repo, then
fill the secrets marked `sync: false` in the dashboard. Here `src/index.ts` is
the entry, the database connects at boot, and rate limiting is exact.

Wherever it lands, two things must line up:

1. Add the site's origin to `CORS_ORIGINS`.
2. Set the repository variable `NEXT_PUBLIC_API_URL` to the API's base URL
   (Settings > Secrets and variables > Actions > Variables) so the Pages build
   inlines it. The frontend is a static export, so this is baked in at build
   time — changing it requires a rebuild.
