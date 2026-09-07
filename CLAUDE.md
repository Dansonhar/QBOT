# CLAUDE.md

Project instructions for Claude Code in this repository.

---

## Progress Reporting Rule

For EVERY task or prompt given in this project, show visible progress while working.

Use progress increments of exactly 10%:

`10% → 20% → 30% → 40% → 50% → 60% → 70% → 80% → 90% → 100%`

### Required behavior

- At the start of every task, show: `Progress: 10%`
- Continue updating the progress as meaningful parts of the task are completed.
- Do not jump directly from 10% to 100% for coding tasks.
- Keep each progress update short.
- Include a very short description of what was completed.

Example:

`Progress: 10% — Reviewing the current implementation.`

`Progress: 20% — Identified the affected components and data flow.`

`Progress: 30% — Implementing the main change.`

Continue until:

`Progress: 100% — Implementation completed and verified.`

### Important rules

1. This applies automatically to every future prompt in this folder.
2. The user should NOT need to remind you to show progress.
3. For code changes, inspect the existing implementation before modifying anything.
4. Do not mark 100% until the requested work is actually completed.
5. If tests or verification are relevant, they must happen before 100%.
6. If something blocks completion, clearly state the blocker and do NOT falsely report 100%.
7. Do not use fake progress based on time. Progress must represent actual completed work.
8. Keep progress messages concise so they do not clutter the conversation.
9. Preserve this rule when updating `CLAUDE.md` in the future.
10. This rule applies regardless of whether the prompt is a bug fix, feature, UI change,
    refactor, investigation, or configuration change.

---

## Project context

Vite + React 18 + TypeScript + Tailwind. Supabase edge functions in `supabase/functions/`.

- **Dev server:** `npm run dev` → port 5174, `strictPort` (5173 belongs to another project).
- **Env:** `.env` needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Several components
  call `createClient()` at module top level, so missing values throw on import and render a
  blank page rather than failing gracefully.
- **Verify before claiming done:** `npx tsc --noEmit -p tsconfig.app.json` and `npx vite build`.

### Do not modify

- `src/pages/QStudioPage.tsx` and `src/pages/QSentryPage.tsx` — their design is fixed by the
  owner. They render their own local `Header`/`Footer` and sit outside `SiteLayout`, so the
  shared chrome can be changed without affecting them.

### Redesign (v3) conventions

- The v3 design system lives in `src/index.css` scoped under `.v3`, so it cannot leak into
  QStudio, QSentry or legacy pages. Monochrome only: black, `--paper`, a grey ramp, plus a
  JetBrains Mono label system. Photography stays in full colour.
- Motion primitives are in `src/components/v3/motion.tsx` (one shared IntersectionObserver,
  `Reveal`, `MaskLines`, `Counter`, `useScrollProgress`). No animation library.
- `[data-mask]` reveals use a sliding curtain and require `overflow: hidden`; a clip-path mask
  zeroes the element's intersection rect and would never trigger its own observer.
- Floating overlays must be portalled to `document.body` — ancestor transforms turn
  `position: fixed` into `position: absolute`.
- Honour `prefers-reduced-motion` in anything animated.

### Content rules

- Do not invent products, features, customers, metrics or business claims. Use copy and
  assets already in the repo.
- Verifiable figures only: 14 modules, 6 sales channels, 17 industries, 5 platform products.
  Unsourced claims such as "30% more revenue" were deliberately removed.

### Git

- The live site is `main`. Work on a branch (currently `redesign-v3`) and never push to `main`
  without being asked.
- The GitHub remote is `Dansonhar/QBOT` and it is **public** — never commit secrets.
