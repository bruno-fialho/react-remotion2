// Primitive registry. Add new primitives here.
// See ./README.md for the contract every primitive must implement.

// NOTE: imports are fully specified (with .jsx) on purpose. package.json sets
// "type": "module", so this .js file is strict ESM and Remotion's bundler refuses to
// guess extensions for it. The starter shipped these extensionless, which broke
// `npm run render` (see WRITEUP).
import crossfade from './transitions/crossfade.jsx';
import dipToBlack from './transitions/dipToBlack.jsx';
import slidePush from './transitions/slidePush.jsx';
import zoomIn from './effects/zoomIn.jsx';
import zoomOut from './effects/zoomOut.jsx';
import panLeft from './effects/panLeft.jsx';
import panRight from './effects/panRight.jsx';
import kenBurns from './effects/kenBurns.jsx';
import colorGrade from './effects/colorGrade.jsx';
import lowerThird from './overlays/lowerThird.jsx';
import titleCard from './overlays/titleCard.jsx';
import bigStatement from './sceneTypes/bigStatement.jsx';

export const PRIMITIVES = [
  crossfade,
  dipToBlack,
  slidePush,
  zoomIn,
  zoomOut,
  panLeft,
  panRight,
  kenBurns,
  colorGrade,
  lowerThird,
  titleCard,
  bigStatement,
];

const byId = new Map(PRIMITIVES.map((p) => [p.id, p]));
const byCategory = PRIMITIVES.reduce((acc, p) => {
  (acc[p.category] ??= []).push(p);
  return acc;
}, {});

export const getPrimitive = (id) => byId.get(id);
export const getPrimitivesByCategory = (category) => byCategory[category] ?? [];

export const CATEGORIES = ['transition', 'effect', 'overlay', 'sceneType'];
