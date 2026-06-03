# TubeGen Video Editor — 24hr Take-Home

We're hiring you to own and evolve the editor that powers [TubeGen](https://tubegen.ai). Here's a realistic taste of the work.

## What's in the box

- A working video editor (React + Vite + Remotion) modeled on TubeGen's real editor architecture: a two-track timeline (Visuals + Audio) with a playhead, a properties panel, an assets sidebar, and a live Remotion `<Player>` preview.
- A demo project in `public/demo/`: a voiceover (`assets/voiceover.mp3`), twelve visual clips (`assets/visuals/001.mp4` … `012.mp4`), the script (`assets/script.txt`), and a `scenes.json` that wires everything onto the timeline.

## Your goal

**Use this editor to produce the most compelling final cut you can of the demo project, then render it to MP4.**

## The catch

Every transition, effect, overlay, animation, or scene type you add to make the cut better has to be a **reusable editor primitive** — implemented as new code inside the editor (typed, configurable, surfaced in the AssetsSidebar / PropertiesPanel / Timeline like the existing primitives), **not hardcoded for this specific video**.

If we drop your editor on a different project tomorrow, every new primitive you built must work there too. Read [`src/editor/extension/README.md`](./src/editor/extension/README.md) first — it shows you exactly where new primitives plug in, with worked examples (camera effects, a crossfade transition, and an overlay) you can fork.

Think of yourself as forking the editor and shipping a new version of it. The final cut is your QA — it proves your primitives actually work end-to-end.

## Time budget

**24 hours of working time.** Spread it however you like across up to 5 calendar days, but track and self-report your hours in `WRITEUP.md`.

## Deliverables

Push to a public GitHub repo:

1. **The forked editor source** — your additions inside `src/editor/extension/` plus any improvements you made to the core editor surface (`Timeline.jsx`, `PropertiesPanel.jsx`, etc.).
2. **The final rendered MP4** at `out/final.mp4`. If >100MB, push a Loom or Drive link in the README.
3. **`WRITEUP.md`** (≤1 page) covering:
   - What primitives you added and why (the product reasoning).
   - The extension pattern you used (how a primitive plugs in — one paragraph).
   - What you'd ship next with another 24 hours.
   - Self-reported hours and what you cut for time.
4. **A 3–5 minute Loom walkthrough**: show the final cut first, then open one of your new primitives and walk us through how it plugs in (open the file, point to where it lives in the registry, demo it on the timeline).

## What we evaluate

| Weight | Criterion | What we're looking for |
|---|---|---|
| **35%** | Final cut quality | Pacing, taste, motion design choices, sound design. Does it look like something a real creator would ship? |
| **25%** | Primitive reusability | Could we apply your additions to a *different* project tomorrow with zero edits? Are they typed and configurable, or did you hardcode the demo's data? |
| **20%** | Code quality | Clean React + Remotion patterns, naming, file organization, performance awareness (memoization, `Sequence`, `premountFor`, etc.). |
| **15%** | Extension architecture | Did you follow the starter's extension seam, or wedge things in? Show us the seam works. |
| **5%**  | Communication | Clarity of `WRITEUP.md` and Loom. We're LATAM-focused, English fluency matters. |

Full score-level breakdown in [`RUBRIC.md`](./RUBRIC.md) — there are no hidden criteria.

## Bonus (not required, signal-positive)

One AI-assisted feature inside the editor — anything from the role description: smart cuts, scene suggestions, content-aware edits, AI-generated transitions, AI-picked B-roll suggestions, etc. If you do this, scope it tight and call it out in the writeup.

**Auto-captions is specifically not the bonus** — we already ship that in TubeGen.

## Out of scope (don't spend time on)

- Authentication / accounts / multi-user.
- Persistence — no save/load to a backend. State in memory is fine.
- Backend rendering services. The starter renders locally via `npx remotion render` and that's all we need.
- Mobile responsive. Desktop-only is fine.

## Setup

```bash
npm install
npm run dev          # http://localhost:5173 — live editor
npm run render       # renders public/demo/ to out/final.mp4
```

A 90-second render at 30fps takes roughly 5–15 minutes on a laptop. Plan your render-iteration time.

## Submission

Reply to your recruiter email with:
1. Public GitHub repo URL.
2. Loom URL.
3. `out/final.mp4` link.

We respond within 5 business days.

---

Questions during the challenge: do **not** email back for clarification — we want to see how you scope ambiguity. Make the call you think is right and explain it in the writeup.
