# Writeup

## Primitives I added

All six are registry primitives — one file under `src/editor/extension/<category>/`, one line in
`primitives.js`. None reads a demo path, magic duration, or scene index; every tunable is a typed
prop with a sane default, so each works on any project.

**Effects**
- **Ken Burns** (`effects/kenBurns.jsx`) — the workhorse. The starter's zoom/pan examples are
  linear and single-axis; this couples an *eased* scale with a 2D drift toward a configurable focal
  point (`originX/Y`), and computes the pan from available overscan so it never reveals an edge.
  Static dog shots become deliberate cinematography. *Why:* most scenes in a faceless explainer are
  near-still — they die without intentional camera motion.
- **Color Grade** (`effects/colorGrade.jsx`) — a zero-cost CSS-filter look layer (brightness /
  contrast / saturation) plus an optional vignette. *Why:* one grade applied across every scene is
  what makes a cut of mixed clips feel like one piece. It composes as the *outermost* effect so the
  vignette frames the final image rather than zooming with it.

**Transitions**
- **Dip to Black** (`transitions/dipToBlack.jsx`) — a centred dip (scrim up over the first half,
  incoming up over the second) used as a section break. Unlike crossfade it works on *any*
  boundary, so it declares no `canApply`. *Why:* the script has a clear hook→explanation pivot; a
  dip sells that beat.
- **Slide Push** (`transitions/slidePush.jsx`) — directional, eased slide-over of the incoming
  scene. *Why:* gives a faster, energetic cut where a soft crossfade would be wrong.

**Overlay**
- **Title Card** (`overlays/titleCard.jsx`) — full-frame spring-driven open title with kicker,
  accent underline, and a legibility scrim; fades out over the first shot. *Why:* every upload
  needs a hook frame.

**Scene type**
- **Big Statement** (`sceneTypes/bigStatement.jsx`) — a data-driven text moment laid *over* the
  footage (a configurable scrim keeps it legible), with a staggered per-word spring and an `accent`
  word highlight. *Why:* lands the payoff line ("Not **random** at all.") without cutting away from
  the scene. No `sceneType` example ships, so this also proves the registry's fourth category needs
  no core change.

Shared tokens live in `extension/theme.js` (easing curves, neutral palette, font) so the primitives
stay visually consistent without hardcoding anything project-specific.

## How a primitive plugs in

The seam is untouched. A primitive is `{ id, label, category, defaultProps, RemotionComponent,
PropertiesEditor, canApply? }` default-exported from one file and listed in `primitives.js`. The
registry is consumed everywhere: `MainComposition`/`VideoItem` look up `RemotionComponent` to render
(effects wrap media via `children`; transitions read `ctx.nextItem` + `renderItem`; overlays/scene
types render standalone on the `o1` track), the PropertiesPanel renders the primitive's
`PropertiesEditor`, and the AssetsSidebar lists it by category. I added zero render branches to the
core compositions.

**Editor-surface improvements (a gap I closed):** the starter only surfaced `effect` + `transition`
in the sidebar and only drew the V1/A1 tracks — so overlays and scene types had *no way to be added
or seen* in the UI. I extended the **AssetsSidebar** to add overlay/sceneType primitives at the
playhead, drew the **O1 track** in the Timeline, and made start/duration editable (with remove) for
those items in the **PropertiesPanel** (scenes stay locked; overlays are positionable). Two small,
justified reducer tweaks back this: `ADD_ITEM` auto-selects the new item, and `APPLY_EFFECT` upserts
by primitive id so re-applying doesn't stack duplicates.

**Bug I fixed in the starter:** `npm run render` was broken out of the box. `package.json` sets
`"type": "module"`, so Remotion's bundler treats every `.js` file as strict ESM and refuses to guess
extensions — but `src/remotion/index.js` (`import { Root } from './Root'`) and
`extension/primitives.js` imported extensionlessly. The editor's Vite tolerated it; the renderer did
not. Fixed by fully-specifying the imports in those two `.js` files. (The Vite editor and the render
now both build clean.)

## Bonus — Auto-enhance (offline heuristic, honestly labelled)

`editor/ai/autoEnhance.js` is a *pure* `suggestEdits(items)` that reads each scene's `type`,
`duration`, and position — nothing project-specific — and returns serializable editor actions: a
consistent grade on every scene, a cycled camera move on static `image` scenes (neighbours never
repeat) with moving `broll`/`animation` left clean, crossfades at image→image boundaries, and a
dip-to-black after the longest scene as a section break. It emits one `UPDATE_ITEM` per scene that
*replaces* that scene's whole enhancement set, so the pass is idempotent — clicking it twice, or on
an already-edited project, lands on the same clean result. The "✨ Auto-enhance" button in the
sidebar just dispatches them. It is a deterministic heuristic, **not an LLM** — it gets a sensible
first pass on the timeline in one click, which is the real editing-speed win; an editor then tunes
from there.

## What I'd ship next with another 24 hours

- **Audio ducking / fades** as a first-class audio-track concern (the current `AudioTrack` only
  supports static volume) — and a soundtrack bed under the voiceover.
- **Overlay drag/trim on the timeline** (today they're positioned via numeric props).
- **A real LLM pass** behind the Auto-enhance seam: feed `script.txt` + scene timings to the model to
  pick *which* statement to pull and *where* emphasis lands, keeping the same `suggestEdits → actions`
  contract.

## Hours & cuts

- **Hours spent:** ~6.
- **What I cut for time:** soundtrack/audio ducking (no licensed track on hand; out of the
  primitive seam anyway), overlay drag-on-timeline (numeric start/duration covers positioning), and
  a wider transition library (kept two distinct ones over many variants).
