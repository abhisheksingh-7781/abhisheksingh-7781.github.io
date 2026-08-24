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

The form validates fully on the client but never pretends to send. Set:

```ts
// src/data/profile.ts
contact: { formEndpoint: '/api/contact' }   // or a Formspree/Resend URL
```

It then POSTs `{ name, email, message }` as JSON. Until it is set, submitting
shows an honest "no backend connected" panel with a mailto fallback.

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
```

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

## Deploying

Any Node host works; Vercel needs no configuration. Before shipping, set
`metadataBase` in `src/app/layout.tsx` to the real domain so social cards
resolve.
