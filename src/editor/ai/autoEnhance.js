// Auto-enhance — a deterministic, offline heuristic that proposes a first-pass edit for a
// set of scenes. It is NOT an LLM: it reads each scene's `type`, `duration`, and position
// (no project-specific data) and returns serializable editor actions the caller dispatches.
//
// Rules, in plain language:
//   - Every scene gets the same colour grade, for one consistent look.
//   - Static `image` scenes get a varied camera move (cycled so neighbours never repeat),
//     to keep motion alive. Already-moving `broll`/`animation` scenes are left clean.
//   - Adjacent image→image boundaries get a crossfade; the boundary after the longest
//     scene gets a dip-to-black as a section break.
//
// It emits ONE `UPDATE_ITEM` per scene that *replaces* that scene's whole enhancement set
// (effects + transition). That makes the pass idempotent and order-independent: clicking
// it twice — or on an already-edited project — always lands on the same, clean result.
//
// Returns: Array<EditorAction> using the reducer's existing `UPDATE_ITEM` shape.

import { ITEM_TYPES, TRACK_TYPES } from '../types';

const GRADE = { id: 'colorGrade', props: { brightness: 1.02, contrast: 1.08, saturate: 1.05, vignette: 0.32 } };

// Cycle of camera moves for static scenes — neighbours stay distinct.
const CAMERA_CYCLE = [
  { id: 'kenBurns', props: { startScale: 1.04, endScale: 1.2, originX: 0.5, originY: 0.35, easing: 'standard' } },
  { id: 'panRight', props: { scale: 1.18, pan: 6 } },
  { id: 'kenBurns', props: { startScale: 1.2, endScale: 1.04, originX: 0.4, originY: 0.5, easing: 'standard' } },
  { id: 'panLeft', props: { scale: 1.18, pan: 6 } },
  { id: 'zoomIn', props: { startScale: 1.0, endScale: 1.14 } },
];

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * @param {Array<object>} items  All timeline items.
 * @returns {Array<object>} serializable editor actions.
 */
export function suggestEdits(items) {
  const scenes = items
    .filter((i) => i.trackId === TRACK_TYPES.V1)
    .sort((a, b) => a.startFrame - b.startFrame);

  // Section break = boundary right after the longest scene (excluding the final scene).
  let breakIdx = -1;
  let longest = -1;
  for (let i = 0; i < scenes.length - 1; i++) {
    if (scenes[i].durationFrames > longest) {
      longest = scenes[i].durationFrames;
      breakIdx = i;
    }
  }

  let cam = 0;
  return scenes.map((scene, i) => {
    const effects = [{ id: GRADE.id, props: clone(GRADE.props) }];
    if (scene.type === ITEM_TYPES.IMAGE) {
      const move = CAMERA_CYCLE[cam % CAMERA_CYCLE.length];
      cam += 1;
      effects.push({ id: move.id, props: clone(move.props) });
    }

    const next = scenes[i + 1];
    let transition = null;
    if (next) {
      if (scene.type === ITEM_TYPES.IMAGE && next.type === ITEM_TYPES.IMAGE) {
        transition = { id: 'crossfade', props: { durationFrames: 15 } };
      } else if (i === breakIdx) {
        transition = { id: 'dipToBlack', props: { durationFrames: 20, color: '#000000' } };
      }
    }

    return { type: 'UPDATE_ITEM', id: scene.id, patch: { effects, transition } };
  });
}
