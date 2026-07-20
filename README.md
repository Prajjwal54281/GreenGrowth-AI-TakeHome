# Greenfield — AI-Powered Tax Platform (prototype)

A clickable frontend prototype for a greenfield tax platform serving **clients and CPAs**. Built as a take-home case study. The frontend is the deliverable — visual design, interaction design, and information architecture. The backend is deliberately fake: seeded data and an in-memory store, no real OCR / AI / auth.

> **Live demo:** **https://greengrowth-ai-tax.vercel.app/dashboard**
> **Reviewer tip:** click **Demo Guide** in the top bar — it lists every challenge with a one-click jump to the exact screen/state that demonstrates it, plus the persona switcher.

I was assigned **all ten challenges** but scoped to a weekend, so I did **not** build all ten at equal depth. I picked four flagships that share two screens and built those deeply, took three more to a solid medium depth, and covered the rest at a genuine-but-lighter depth. Depth on a few beats shallow coverage of many. The split is called out honestly below and tagged in the UI (the little `01`…`10` chips).

---

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # type-checks + production build
npm run preview  # serve the production build
```

Requires Node 18+. No environment variables, no services to start — everything runs in the browser.

---

## The 60-second tour (what to click)

1. **Dashboard (07)** — lands here as a preparer. This answers "what should I work on right now?" Hover any **score** to see *why* it ranks. Toggle **My queue ↔ Team (manager)**.
2. **Return review (01 · 08 · 10)** — click into a return, or open `/returns/RET-1001/review`. Click a **field** on the left → its **source regions** highlight on the document. Click a **document box** → the fields it feeds highlight back.
3. **The wrong AI value (10)** — open the **Capital gain** field. The AI value here is *deliberately wrong* and **Accept is disabled**. Use **Reject → edit → save**. Then go back to the dashboard: the return's "AI value needs correction" flag is gone and its score dropped. Corrections really change state.
4. **Persona switch (05)** — top-right. Try **Priya Nair**: she's firm staff who *also* has a personal return, and can flip between **Staff mode** and **My taxes**.
5. **Client first-run (03)** — switch to **Sarah Chen** (client), or **Daniel Okonkwo** for the business-entity version. One primary task dominates; toggle **First run ↔ After onboarding**.
6. **Roles & permissions (05)** — switch to **Elena Vargas** (firm admin) and open **Firm & roles** for the role × capability matrix the shell actually enforces.

---

## What's real vs. simulated

I tried to be precise here rather than hand-wavy.

### Genuinely real (actually working code)
- **The whole UI and every interaction** — routing, navigation, highlighting, filtering, search, grouping, editing, the correction flow. If the README says you can click it, you can click it.
- **Real deep-linkable routes** (React Router). Every field, document, thread, and return has its own URL; refresh keeps your place.
- **The prioritization engine** (`src/logic/priority.ts`) is real code, not a static sort. It scores 500+ returns on deadline proximity, days-waiting-on-client, blocked status, review flags, and AI trust signals, and produces the human-readable reasons behind each rank.
- **The correction flow mutates real state.** Accept / edit / reject updates an in-memory store, and the return's flags, progress, dashboard score, and status view are recomputed from that state (`src/state/AppState.tsx`). Fix the capital-gain field and the dashboard reflects it immediately.
- **The affordance system (08)** is a real design-token layer (`src/design/affordances.ts`, `src/index.css`) reused across every screen — not per-screen styling.

### Simulated (faked on purpose)
- **No OCR / document parsing.** The "documents" are styled HTML mockups of a W-2, 1099-INT, 1099-DIV, and a brokerage statement (`src/components/documents/Facsimile.tsx`). The traceability regions are hand-authored coordinates, positioned so highlights line up with the mock — nothing is being read from an image.
- **No AI model.** Confidence scores, rationales, "what it did", and suggestions are seeded fake data (`src/data/hero.ts`). The one *wrong* suggestion is hardcoded so the correction flow has something real to do.
- **No auth.** The persona switcher just swaps a seed record; there's no login. Role gating is real in the sense that staff-only routes actually redirect a client context away and internal notes are filtered out for clients — but it's all presentation-layer. A real build would enforce this on a server; nothing here would stop someone with devtools.
- **No backend / database.** All data lives in memory, seeded on load. There's a `useSimulatedLoad` hook that adds artificial latency so loading states are real, but the data itself isn't fetched over a network.
- **State is session-only.** A full page reload resets the seeded world (that's expected for an in-memory prototype). Navigate via the app's links to keep your changes.
- **Only one return has field-level detail.** Sarah Chen's return (`RET-1001`) is the fully-seeded one — documents, traceability regions, AI output, threads, and 245 questionnaire/warning items. Priya's personal return and Blue Harbor's 1120S are lightly seeded so the role experiences are real. The other ~520 returns exist so the dashboard's prioritization is exercised against realistic volume; opening one shows an explicit "no seeded detail" state pointing you back to the real one, rather than a blank screen. That was a deliberate trade: one deep return beats 520 shallow ones for showing the interaction model.

---

## Design decisions, per challenge

Written in my own rough words — I'd tighten these before submitting.

**01 · Source Document Traceability (flagship).** I made the review screen literally side-by-side: fields on the left, the document on the right, and the link between them is *bidirectional* — click a field to light up its source regions, click a region to light up the fields it feeds. The thing I most wanted to nail is the case where two W-2 Box 1 values sum into one 1040 line; I show that as an explicit calculation breakdown so a CPA never has to take the number on faith. The Fidelity statement is deliberately two pages — the totals are on page 1 but the lot detail that explains the basis is on page 2 — so traceability has to resolve to an exact *page*, and the viewer jumps there. Traceability isn't a tooltip here, it's the primary layout.

**02 · Client & CPA Collaboration (light).** Every thread is *attached to an object* — a specific field, a specific document, or the return as a whole — so there's no free-floating inbox. Internal notes get an unmistakable treatment (amber left border + an "INTERNAL ONLY" badge) and are filtered out entirely for the client persona, so the internal/external boundary is visual, not a setting you have to remember. Each thread states who owns the next action, because "who's turn is it" is the question that actually stalls tax work.

**03 · Where to Start (medium).** The first-run client screen is ruthless about focus: one primary task fills a hero card, everything else is deferred behind a gentle "this is all you need right now" note. Progress is always visible as a five-step bar so a new client can place themselves. I added an explicit "After onboarding" toggle to show how the UI relaxes and reveals more tools once the person isn't brand new — the two states are genuinely different layouts, not the same screen with more text.

**04 · Navigation Without Getting Lost (medium).** Three things carry orientation: breadcrumbs that resolve object IDs to human labels, a "Related objects" panel present on every entity that shows what *this* thing connects to, and a "Recently viewed" trail in the top bar that's smarter than the browser back button. Everything is a real route, so deep links and refresh never lose your place — that's the backbone the flagships lean on too.

**05 · Role-Aware Experiences (medium).** One shell, six roles: individual taxpayer, business owner, preparer, reviewer/manager, firm administrator, and seasonal staff. Nav and landing screens come from a single `navForRole` config rather than forked apps, and the routes are actually gated — a client context gets bounced off staff screens and can't read another client's threads even by URL. The admin screen shows the role/permission matrix explicitly, because "how permissions are communicated" matters as much as enforcing them. I specifically built the awkward edge case — Priya is firm staff *and* a client — as a "Staff mode / My taxes" toggle backed by her own real return, since that context switch is where role systems usually get confusing.

**06 · Return Status & Progress (medium).** There is exactly *one* stage model (`src/data/stages.ts`); the client rendering uses plain-language labels ("We're preparing your return") and the staff rendering uses operational labels plus owner/next-action/blocker. Because both read from the same source, they can't tell two different stories — which is the whole point of the challenge. A banner up top always answers the four questions: where is it, who owns next, what's next, is anything blocking.

**07 · Actionable Dashboard (flagship).** I organized the landing page around a decision — "do this next" — not around reporting. The book is 523 returns and Marcus alone carries ~200, because the brief asks that this stay usable when one person owns hundreds. The queue is ranked by a real scoring function over all of them (only the render is capped, and the header says so), and crucially every row *explains itself* with reason chips and an inspectable score, so it's not a black box. The stat tiles double as one-click filters, and there's a manager lens (team workload) and a preparer lens (my queue). One click from any row lands you in the actual work.

**08 · Clickable vs. Editable (flagship).** This is a token layer, not a screen. Five value-states — AI-unverified, verified, editable, needs-approval, locked — each get a consistent color, icon, and a hover explanation of *why* it's in that state. There's a legend/key component, and the system shows up identically on the review screen, the items explorer, and the design-system page. Editable values are actually click-to-edit; locked ones tell you why they can't change.

**09 · Complexity Made Navigable (medium).** I seeded one return with 200+ mixed items (documents, fields, questions, warnings, messages, requests) so search/filter/group get tested against real volume. The explorer lets you search across everything, filter by kind and by affordance-state, and group by kind/section/state, then drill from any summary row into its source detail. A persistent context header always tells you which return and section you're in.

**10 · Trustworthy AI (flagship).** Everywhere AI output appears, the same panel explains it: what it did, why, the evidence (linked straight to the source region), and a *designed* confidence indicator (signal bars + a plain-language band, not a naked percentage). The correction flow is inline — accept / edit / reject — and it visibly changes state (unverified → verified) and ripples to the dashboard and status. I deliberately made one suggestion wrong and disabled "Accept" on it, so the safe path is to correct it, not rubber-stamp it. The goal was appropriate transparency, not a raw technical dump.

---

## Required edge cases (all wired in and clickable)

- **Low-confidence extraction** — the interest income field (52% confidence, "blurry scan").
- **Two documents conflicting on one field** — capital-gains cost basis: Fidelity statement ($38,900) vs. the client's 1099-B ($41,200).
- **A blocked return** — RET-1001 is blocked waiting on the client's 1099-B.
- **An overdue client request** — "Upload 1099-B from Fidelity" is past due on the Tasks screen.
- **An AI suggestion that is actually wrong** — the capital-gain value ($3,600) doesn't reconcile; Accept is disabled; reject/edit fixes it and the dashboard updates.

---

## How it's built

- **Stack:** React + Vite + TypeScript + Tailwind v4, React Router (real routes).
- **Design tokens:** `src/index.css` (`@theme`) + `src/design/affordances.ts`. Colors, type scale, and the affordance states are first-class tokens.
- **Data:** `src/data/` — typed domain model (`types.ts`), the hand-authored hero return (`hero.ts`), generated volume (`generate.ts`), assembled world (`world.ts`).
- **Fake "API":** an in-memory reactive store (`src/state/AppState.tsx`) + `useSimulatedLoad` for honest loading states.
- **Logic:** `src/logic/priority.ts` (dashboard ranking).
- **Shell:** `src/shell/` (sidebar, top bar, breadcrumbs, demo guide).

---

## What I'd build next with more time

- **Server + real persistence** so corrections and messages survive a reload, and a thin fake API boundary I could later swap for a real one.
- **Real permission enforcement** behind the role system, instead of UI-only gating — including audit trails for who verified what.
- **A real document viewer** (PDF/image) with OCR-backed regions, replacing the styled mockups, plus a "why this region" explanation from the model.
- **Keyboard-first review** — a CPA reviewing hundreds of fields wants to fly through accept/edit/reject without a mouse.
- **Bulk actions on the dashboard** (e.g. "nudge all clients waiting >10 days") and saved queue views per preparer.
- **Accessibility pass** — focus management on the slide-overs, ARIA for the highlight-linking, and reduced-motion handling.
