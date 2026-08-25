# Abhishek Singh — Portfolio

A dark-first, motion-led personal site presenting one person working across two
disciplines: **Full Stack Development** and **Data Analytics**.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer
Motion, GSAP ScrollTrigger, Lenis, Lucide and Recharts.

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm run start
```

---

## Where the content lives

**No copy is hardcoded in components.** Everything editable sits in `src/data/`.

| File | What it controls |
| --- | --- |
| `src/data/profile.ts` | Central config: name, roles, graduation, email, hero copy, about copy, the two discipline blocks, contact copy, form endpoint |
| `src/data/links.ts` | GitHub / LinkedIn / Résumé / Email — used by nav, footer, contact and the "Elsewhere" grid |
| `src/data/projects.ts` | Project cards **and** their full case studies |
| `src/data/skills.ts` | Skill categories, tags and the marquee toolbelt |
| `src/data/experience.ts` | Timeline roles and certifications |
| `src/data/education.ts` | Degree, institution, focus areas |
| `src/data/analytics.ts` | Demo chart data for the analytics dashboard |
| `src/data/navigation.ts` | Nav items (each `id` must match a section `id`) |

### The placeholder convention

Anything not yet supplied is written as a bracketed string:

```ts
github: '[GITHUB URL]',
```

`src/data/placeholders.ts` detects that shape, and the UI renders it as a
visibly unfinished value instead of a dead link or an invented fact:

- `<Value>` shows text as a dashed-underlined placeholder
- `<SmartLink>` renders an inert, `aria-disabled` element instead of an anchor
- `<PlaceholderMedia>` shows a dashed frame where an image will go

**To go live, replace the bracketed string with the real value.** Nothing else
needs to change.

### What is real vs. still a placeholder

Content comes from Abhishek's CV plus his public GitHub. Real and wired up:

- Three projects with live repository links — **AI Chatbot** (Chat-GPT),
  **Blinkit** grocery app, and **Zaptro**, the hackathon storefront, which also
  has a live demo on Vercel
- GitHub and LinkedIn profile URLs
- The Humming Byte Technologies internship, technical skills, BSc IT at
  Patliputra University, HSC, and the Sheryians hackathon certificate
- Email, phone, location, résumé PDF, certificate PDF

**Every link on the page resolves — there are no dead or placeholder URLs left.**

Still bracketed, waiting on real values:

- `profileImage` in `src/data/profile.ts` (the GitHub avatar is not a headshot)
- Project screenshots, and `[LIVE DEMO URL]` for the chatbot and grocery app if
  they ever get deployed
- `[RESULT OR OUTCOME]` / `[WHAT YOU LEARNED]` for the chatbot and grocery app
- `[TECHNOLOGY USED]` for the internship, `[LOCATION]` for the internship and
  education entries, `[FOCUS AREA]` for the degree
- Two `[ADDITIONAL DATA …]` slots in the Data & Analytics skill group

### Documents in /public

- `abhishek-singh-resume.pdf` — linked from the Résumé card
- `abhishek-singh-hackathon-certificate.pdf` — linked from the certification card

### Adding a project

Copy one object in `src/data/projects.ts`, replace the bracketed fields, drop
screenshots into `/public` and point `image` at them. The card, the hover
states and the case-study modal all read from that object.

### Connecting the contact form

The form posts to the API in [`server/`](server/README.md). Point the site at
it by setting one variable:

```bash
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm --prefix server install
npm --prefix server run dev        # API on :4000
npm run dev                        # site on :3000
```

The form's badge turns from "Backend not connected" to "Connected", and
submissions go to `<NEXT_PUBLIC_API_URL>/api/contact`.

Because the site is a **static export**, that URL is inlined at build time, so
changing it means rebuilding. For the deployed site, set `NEXT_PUBLIC_API_URL`
as a repository variable (Settings > Secrets and variables > Actions >
Variables); the Pages workflow passes it through.

With the variable unset the form keeps its old behaviour: it validates fully,
never pretends to send, and shows an honest "no backend connected" panel with a
mailto fallback.

### Adding a profile photo

Drop the file in `/public` and set `profileImage: '/abhishek.jpg'` in
`src/data/profile.ts`.

---

## Architecture

```text
src/
├── app/                  layout.tsx · page.tsx · globals.css
├── components/
│   ├── navbar/           sticky nav, active-section tracking, mobile menu
│   ├── hero/             hero + canvas node/curve field
│   ├── about/            two-discipline introduction
│   ├── skills/           filterable skill clusters + marquee
│   ├── developer-data/   the Build ↔ Analyze duality visual
│   ├── projects/         cards + case-study modal
│   ├── analytics/        dashboard (Recharts) + workflow rail
│   ├── experience/       animated timeline + certifications
│   ├── education/        graduation + degree cards
│   ├── links/            GitHub / LinkedIn / Résumé / Email grid
│   ├── contact/          CTA + validated form
│   ├── footer/           navigation, links, back-to-top
│   ├── providers/        MotionConfig + Lenis/GSAP wiring
│   └── ui/               Button · Tag · Reveal · SectionHeading · placeholders
├── data/                 all editable content (see above)
├── animations/           motion.ts (variants) · gsap.ts (scoped scenes)
└── lib/                  hooks.ts · utils.ts · types.d.ts

server/                   Express + TypeScript API (see server/README.md)
├── src/
│   ├── config/           env.ts — every setting, validated once at boot
│   ├── routes/           health.ts · contact.ts
│   ├── services/         database · mailer · contact-service
│   ├── middleware/       rate-limit · admin-auth · error-handler
│   ├── validation/       contact.ts — mirrors the client-side rules
│   ├── models/           message.ts (Mongoose)
│   ├── app.ts            Express assembly (CORS, helmet, JSON, routing)
│   └── index.ts          bootstrap + graceful shutdown (long-running hosts)
├── api/index.ts          Vercel serverless entry (per-request handler)
└── Dockerfile · render.yaml · vercel.json
```

The API is a **separate service** because the site is a static export: GitHub
Pages serves files and runs no server code, so Next.js API routes cannot run
there. Keeping it separate leaves the existing Pages deployment untouched.

## Design system

Defined once in `tailwind.config.ts` and `src/app/globals.css`.

- **Colour** — `ink` charcoal scale, `chalk` text scale, one primary accent
  (`accent`, jade) for the *build* side and one secondary (`data`, amber)
  reserved for the *analyze* side. The two-accent split is the concept, not
  decoration: it is how the site shows one person doing two things.
- **Type** — Inter for UI, Instrument Serif italic for display accents,
  JetBrains Mono for eyebrows, tags and numerals. Display sizes are fluid
  `clamp()` values, so hierarchy holds from 320px to 1440px.
- **Motion** — one easing curve and four durations in
  `src/animations/motion.ts`. Sections compose shared variants rather than
  inventing their own.

## Motion and performance notes

- Framer Motion handles reveals, hover, modal and menu transitions.
- GSAP is used only for genuinely scroll-linked work: the hero entrance
  timeline and the hero scrub. Every scene runs inside `gsap.context()` and is
  reverted on unmount, so no ScrollTrigger leaks across renders.
- Lenis is driven by the GSAP ticker so both share one RAF loop.
- Recharts is `next/dynamic`-imported (`ssr: false`), keeping it out of the
  initial bundle until the analytics section mounts.
- The hero canvas caps its node count, stops its loop when off-screen or when
  the tab is hidden, and renders a single static frame under reduced motion.

## Accessibility

- Semantic landmarks, one `h1`, and a section-per-`h2` hierarchy
- Skip-to-content link, visible focus rings, keyboard-operable nav and modal
  (focus trap + Escape + scroll lock)
- `prefers-reduced-motion` is respected globally through
  `<MotionConfig reducedMotion="user">`, a CSS override, and explicit checks
  before starting Lenis, the canvas field, the marquee and the custom cursor
- The custom cursor and magnetic buttons only activate on fine-pointer devices

## Honesty rules this codebase follows

- No invented projects, employers, dates, metrics or credentials
- Dashboard figures are sample data and are labelled **Demo data** in the UI
- No skill percentages — skills are shown as clusters, not fabricated scores
- No placeholder URL is ever rendered as a working link
- The contact form never reports success for a message that was not delivered
  or stored — the API returns 503 rather than silently dropping it

## Deploying

**Site.** Pushing to `main` builds the static export and publishes it to GitHub
Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Before
shipping, set `metadataBase` in `src/app/layout.tsx` to the real domain so
social cards resolve.

**API.** Deploy `server/` anywhere that runs Node. Vercel
([vercel.json](server/vercel.json), root directory `server`), Render
([render.yaml](server/render.yaml)) and Docker
([Dockerfile](server/Dockerfile)) are all set up. Two things must line up
afterwards:

1. Add the site's origin to the API's `CORS_ORIGINS`, or the form gets a 403.
2. Set the `NEXT_PUBLIC_API_URL` repository variable to the API's base URL and
   re-run the Pages workflow, so the endpoint is inlined into the build.

Full configuration reference: [server/README.md](server/README.md).
