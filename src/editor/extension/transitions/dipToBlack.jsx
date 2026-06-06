// Transition: dip to black — the outgoing scene fades down to a solid colour, then the
// incoming scene rises out of it. A classic "section break" beat that, unlike a
// crossfade, works cleanly between *any* two scenes (moving footage included), so it
// declares no `canApply`.
//
// Seam note: a transition only renders over the OUTGOING scene's last `dur` frames (the
// outgoing scene keeps playing underneath). To get a *centred* dip within that window we
// ramp a solid scrim 0→1 over the first half (covering the live outgoing scene), then
// fade the incoming scene in 0→1 over the second half on top of the scrim. The window
// peaks at full colour at its midpoint; at the cut the real next Sequence takes over.

import { AbsoluteFill, Freeze, useCurrentFrame, interpolate } from 'remotion';

/**
 * @typedef {Object} DipToBlackProps
 * @property {number} durationFrames  Total dip length (the seam clamps this to the scene).
 * @property {string} color           Dip colour (default black).
 */

/** @param {{ props: DipToBlackProps, ctx: { durationFrames: number, nextItem: object }, renderItem: (item: object) => React.ReactNode }} _ */
const DipToBlackRender = ({ props, ctx, renderItem }) => {
  const frame = useCurrentFrame();
  const { durationFrames, nextItem } = ctx;
  const { color = '#000000' } = props;
  const mid = durationFrames / 2;

  const scrim = interpolate(frame, [0, mid], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const incoming = interpolate(frame, [mid, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: color, opacity: scrim }} />
      <AbsoluteFill style={{ opacity: incoming }}>
        <Freeze frame={0}>{renderItem(nextItem)}</Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DipToBlackProps = ({ props, onChange }) => (
  <div className="props-form">
    <label>
      Duration (frames @ 30fps)
      <input
        type="number" step="1" min="2" max="90"
        value={props.durationFrames}
        onChange={(e) => onChange({ ...props, durationFrames: parseInt(e.target.value, 10) || 2 })}
      />
    </label>
    <label>
      Dip color
      <input type="color" value={props.color} onChange={(e) => onChange({ ...props, color: e.target.value })} />
    </label>
  </div>
);

export default {
  id: 'dipToBlack',
  label: 'Dip to Black',
  category: 'transition',
  defaultProps: { durationFrames: 20, color: '#000000' },
  RemotionComponent: DipToBlackRender,
  PropertiesEditor: DipToBlackProps,
};
