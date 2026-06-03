# Scoring Rubric

This is exactly how your submission is evaluated — no hidden criteria. Use it to prioritize.

| Weight | Criterion |
|---|---|
| **35%** | Final cut quality |
| **25%** | Primitive reusability |
| **20%** | Code quality |
| **15%** | Extension architecture |
| **5%**  | Communication |

---

## 1. Final cut quality — 35%

Watch your `out/final.mp4` against the unedited baseline.

| Score | What it looks like |
|---|---|
| 5 | Looks like a polished YouTube upload. Pacing serves the voiceover. Music sits underneath. Transitions feel intentional. We'd watch the whole thing. |
| 4 | Clearly thought through. Some moments are great, others are flat. Net better than baseline. |
| 3 | Better than the unedited baseline but uneven. A few choices land, several feel arbitrary. |
| 2 | Marginal improvement on baseline. Cuts feel mechanical. Music/voice mix off. |
| 1 | Worse than baseline, or no apparent editing intent. |

## 2. Primitive reusability — 25%

We open `src/editor/extension/` and a primitive you added, then mentally apply it to a *different* project (different voiceover, image set, durations). Does it still work?

| Score | What it looks like |
|---|---|
| 5 | Every primitive accepts typed props. Zero hardcoded references to demo assets, durations, or scene indices. Could ship to prod tomorrow. |
| 4 | Almost there. One or two props could be cleaner but nothing is hardcoded. |
| 3 | Mixed — some primitives are reusable, others have demo-specific magic numbers or paths. |
| 2 | Most additions are tied to the demo. Would need rewriting to reuse. |
| 1 | Hand-placed effects directly on demo data. Doesn't follow the registry pattern. |

## 3. Code quality — 20%

| Score | What it looks like |
|---|---|
| 5 | Clean React + Remotion idioms. Memoized where it matters. `Sequence`/`premountFor` used. Components are small and named well. |
| 4 | Solid code. Minor nits — naming, prop drilling, missed memo. |
| 3 | Works but rough — long components, weak naming, no perf awareness. |
| 2 | Hard to read. State scattered. Likely re-renders on every frame. |
| 1 | Doesn't actually run / breaks on render / clear React anti-patterns. |

## 4. Extension architecture — 15%

Did you follow [`src/editor/extension/README.md`](./src/editor/extension/README.md), or wedge things into `MainComposition` / `VideoItem` directly?

| Score | What it looks like |
|---|---|
| 5 | Every primitive plugged in via the registry. No edits to core files beyond the seam. Bonus: improved the extension contract itself. |
| 4 | Followed the pattern with one or two minor seam violations. |
| 3 | Mostly followed it, but several primitives bypass the registry. |
| 2 | Edited core files to wedge primitives in directly. |
| 1 | Ignored the seam. Hardcoded everything. |

## 5. Communication — 5%

| Score | What it looks like |
|---|---|
| 5 | Loom is crisp and well-paced. Writeup explains *why* before *what*. English is clear and confident. |
| 4 | Solid writeup and Loom. Minor verbal awkwardness or padding. |
| 3 | Gets the points across but rambling or unclear in places. |
| 2 | Hard to follow, or one of {Loom, writeup} is missing. |
| 1 | Both Loom and writeup missing or unintelligible. |

---

## Things that hurt your score

- **New visual effects in the final cut, but no primitives in `extension/`** → you hand-placed instead of building reusable primitives. This is the single biggest miss.
- **Several primitives that are just styled variants of the worked examples** → low-effort. Show range.
- **Final cut renders broken / silent / desynced audio** → you didn't run `npm run render` yourself before submitting.
- **Magic numbers or `/demo/` paths baked into a primitive** → not reusable.

## Things that help your score

- Improving the extension contract itself in `extension/README.md`.
- Catching and fixing a bug in the starter (note it in your writeup).
- An AI-assisted feature that genuinely speeds editing (see the bonus in [`CHALLENGE.md`](./CHALLENGE.md)).
- Thoughtful motion design — easing, timing, restraint.
