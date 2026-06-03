// Shared types & constants for the editor.
// Modeled on TubeGen's production editor (ITEM_TYPES, TRACK_TYPES, ASPECT_RATIOS).

export const ITEM_TYPES = Object.freeze({
  IMAGE: 'image',
  ANIMATION: 'animation',
  BROLL: 'broll',
  OVERLAY: 'overlay',     // primitive instances of category === 'overlay'
  SCENE_TYPE: 'sceneType',// primitive instances of category === 'sceneType' (charts, maps, etc.)
  VOICEOVER: 'voiceover',
  SOUNDTRACK: 'soundtrack',
});

export const TRACK_TYPES = Object.freeze({
  V1: 'v1',  // primary video track (images / animations / broll)
  O1: 'o1',  // overlay track (lower-thirds, callouts)
  A1: 'a1',  // voiceover
  A2: 'a2',  // soundtrack
});

export const ASPECT_RATIOS = Object.freeze({
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
});

export const FPS = 30;

// A timeline item is a typed, serializable record.
//
// {
//   id: string,
//   type: ITEM_TYPES,
//   trackId: TRACK_TYPES,
//   src?: string,              // media URL for image/animation/broll/voiceover/soundtrack
//   startFrame: number,        // inclusive
//   durationFrames: number,
//   volume?: number,           // audio only
//   effects?: Array<{ id, props }>,   // applied 'effect' primitives, in order
//   transition?: { id, props },        // 'transition' primitive at the OUTGOING edge of this item
//   primitiveId?: string,      // for OVERLAY / SCENE_TYPE — references PRIMITIVES registry
//   primitiveProps?: object,   // for OVERLAY / SCENE_TYPE — user-tuned props
// }
//
// Keep this shape JSON-serializable. The render script reads scenes.json with this
// shape directly — no transformation layer.

export const makeItemId = () => `item_${Math.random().toString(36).slice(2, 10)}`;
