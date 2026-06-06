// Camera effect: Ken Burns — a slow, eased zoom combined with a drift toward a focal
// point. Unlike the linear single-axis zoom/pan examples, this couples scale + 2D
// translation on an eased curve and lets you aim the move at any point in the frame, so
// a static clip reads as deliberate cinematography.
//
// Resolution-independent: translation is expressed as a % of the frame, and the focal
// point is normalized 0..1.

import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { resolveEasing } from '../theme';

/**
 * @typedef {Object} KenBurnsProps
 * @property {number} startScale  Scale at the first frame (1 = fit).
 * @property {number} endScale    Scale at the last frame.
 * @property {number} originX      Focal point X, 0 (left) .. 1 (right).
 * @property {number} originY      Focal point Y, 0 (top) .. 1 (bottom).
 * @property {keyof import('../theme').EASING} easing  Named easing curve.
 */

/** @param {{ props: KenBurnsProps, ctx: { durationFrames: number }, children: React.ReactNode }} _ */
const KenBurnsRender = ({ props, ctx, children }) => {
  const frame = useCurrentFrame();
  const { durationFrames } = ctx;
  const {
    startScale = 1.05,
    endScale = 1.2,
    originX = 0.5,
    originY = 0.5,
    easing = 'standard',
  } = props;

  const ease = resolveEasing(easing);
  const t = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  const scale = interpolate(t, [0, 1], [startScale, endScale]);
  // Drift the framing toward the focal point. Offset is proportional to how far the
  // focal point sits from center and to the extra scale (so we never reveal edges).
  const overscan = Math.max(0, scale - 1) * 50; // % of frame available to pan within
  const x = interpolate(t, [0, 1], [0, (0.5 - originX) * 2 * overscan]);
  const y = interpolate(t, [0, 1], [0, (0.5 - originY) * 2 * overscan]);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${x}%, ${y}%)`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const num = (props, onChange, key, attrs) => (
  <label>
    {attrs.label}
    <input
      type="number"
      step={attrs.step}
      min={attrs.min}
      max={attrs.max}
      value={props[key]}
      onChange={(e) => onChange({ ...props, [key]: parseFloat(e.target.value) })}
    />
  </label>
);

const KenBurnsProps = ({ props, onChange }) => (
  <div className="props-form">
    {num(props, onChange, 'startScale', { label: 'Start scale', step: '0.05', min: '1', max: '2' })}
    {num(props, onChange, 'endScale', { label: 'End scale', step: '0.05', min: '1', max: '2' })}
    {num(props, onChange, 'originX', { label: 'Focus X (0–1)', step: '0.05', min: '0', max: '1' })}
    {num(props, onChange, 'originY', { label: 'Focus Y (0–1)', step: '0.05', min: '0', max: '1' })}
    <label>
      Easing
      <select value={props.easing} onChange={(e) => onChange({ ...props, easing: e.target.value })}>
        <option value="standard">Standard</option>
        <option value="easeOut">Ease out</option>
        <option value="linear">Linear</option>
      </select>
    </label>
  </div>
);

export default {
  id: 'kenBurns',
  label: 'Ken Burns',
  category: 'effect',
  defaultProps: { startScale: 1.05, endScale: 1.2, originX: 0.5, originY: 0.4, easing: 'standard' },
  RemotionComponent: KenBurnsRender,
  PropertiesEditor: KenBurnsProps,
};
