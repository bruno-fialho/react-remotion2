// Transition: slide push — the incoming scene slides in from one edge and covers the
// outgoing one, with an eased deceleration so it settles rather than snaps. Gives an
// energetic, directional cut that suits faster beats where a crossfade would feel soft.
//
// Seam note: the transition renders over the outgoing scene's last `dur` frames. We
// translate the incoming scene (frozen at frame 0) from off-screen to rest on top of the
// still-playing outgoing scene — a slide-over. At the cut the live next Sequence resumes.

import { AbsoluteFill, Freeze, useCurrentFrame, interpolate } from 'remotion';
import { EASING } from '../theme';

/**
 * @typedef {'left'|'right'|'up'|'down'} SlideDirection
 * @typedef {Object} SlidePushProps
 * @property {number} durationFrames  Slide length (the seam clamps this to the scene).
 * @property {SlideDirection} direction  Edge the incoming scene enters from.
 */

const OFFSCREEN = {
  left: ['-100%', '0%', 'X'], // enters from the left
  right: ['100%', '0%', 'X'],
  up: ['-100%', '0%', 'Y'],
  down: ['100%', '0%', 'Y'],
};

/** @param {{ props: SlidePushProps, ctx: { durationFrames: number, nextItem: object }, renderItem: (item: object) => React.ReactNode }} _ */
const SlidePushRender = ({ props, ctx, renderItem }) => {
  const frame = useCurrentFrame();
  const { durationFrames, nextItem } = ctx;
  const { direction = 'right' } = props;
  const [fromPct, , axis] = OFFSCREEN[direction] ?? OFFSCREEN.right;

  const progress = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASING.easeOut,
  });
  const offset = interpolate(progress, [0, 1], [parseFloat(fromPct), 0]);
  const transform = axis === 'X' ? `translateX(${offset}%)` : `translateY(${offset}%)`;

  return (
    <AbsoluteFill style={{ transform }}>
      <Freeze frame={0}>{renderItem(nextItem)}</Freeze>
    </AbsoluteFill>
  );
};

const SlidePushProps = ({ props, onChange }) => (
  <div className="props-form">
    <label>
      Duration (frames @ 30fps)
      <input
        type="number" step="1" min="2" max="60"
        value={props.durationFrames}
        onChange={(e) => onChange({ ...props, durationFrames: parseInt(e.target.value, 10) || 2 })}
      />
    </label>
    <label>
      Direction
      <select value={props.direction} onChange={(e) => onChange({ ...props, direction: e.target.value })}>
        <option value="right">From right</option>
        <option value="left">From left</option>
        <option value="up">From top</option>
        <option value="down">From bottom</option>
      </select>
    </label>
  </div>
);

export default {
  id: 'slidePush',
  label: 'Slide Push',
  category: 'transition',
  defaultProps: { durationFrames: 18, direction: 'right' },
  RemotionComponent: SlidePushRender,
  PropertiesEditor: SlidePushProps,
};
