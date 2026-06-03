// Primitive registry. Add new primitives here.
// See ./README.md for the contract every primitive must implement.

import crossfade from './transitions/crossfade';
import zoomIn from './effects/zoomIn';
import zoomOut from './effects/zoomOut';
import panLeft from './effects/panLeft';
import panRight from './effects/panRight';
import lowerThird from './overlays/lowerThird';

export const PRIMITIVES = [
  crossfade,
  zoomIn,
  zoomOut,
  panLeft,
  panRight,
  lowerThird,
];

const byId = new Map(PRIMITIVES.map((p) => [p.id, p]));
const byCategory = PRIMITIVES.reduce((acc, p) => {
  (acc[p.category] ??= []).push(p);
  return acc;
}, {});

export const getPrimitive = (id) => byId.get(id);
export const getPrimitivesByCategory = (category) => byCategory[category] ?? [];

export const CATEGORIES = ['transition', 'effect', 'overlay', 'sceneType'];
