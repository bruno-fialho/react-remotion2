// Camera effect: color grade — a static look layer (brightness / contrast / saturation)
// plus an optional vignette. Applied across every scene it gives a cut one consistent,
// cinematic tone. It's a pure CSS-filter wrapper, so it costs nothing per frame and
// composes on top of any other effect.

import { AbsoluteFill } from 'remotion';
import { PALETTE } from '../theme';

/**
 * @typedef {Object} ColorGradeProps
 * @property {number} brightness  1 = unchanged.
 * @property {number} contrast    1 = unchanged.
 * @property {number} saturate    1 = unchanged.
 * @property {number} vignette    0 = none .. 1 = strong corner darkening.
 */

/** @param {{ props: ColorGradeProps, children: React.ReactNode }} _ */
const ColorGradeRender = ({ props, children }) => {
  const { brightness = 1, contrast = 1, saturate = 1, vignette = 0 } = props;

  return (
    <AbsoluteFill
      style={{ filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate})` }}
    >
      {children}
      {vignette > 0 && (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(120% 120% at 50% 50%, transparent 55%, ${PALETTE.ink} 140%)`,
            opacity: vignette,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const slider = (props, onChange, key, attrs) => (
  <label>
    {attrs.label}
    <input
      type="range"
      step={attrs.step}
      min={attrs.min}
      max={attrs.max}
      value={props[key]}
      onChange={(e) => onChange({ ...props, [key]: parseFloat(e.target.value) })}
    />
  </label>
);

const ColorGradeProps = ({ props, onChange }) => (
  <div className="props-form">
    {slider(props, onChange, 'brightness', { label: 'Brightness', step: '0.01', min: '0.5', max: '1.5' })}
    {slider(props, onChange, 'contrast', { label: 'Contrast', step: '0.01', min: '0.5', max: '1.5' })}
    {slider(props, onChange, 'saturate', { label: 'Saturation', step: '0.01', min: '0', max: '2' })}
    {slider(props, onChange, 'vignette', { label: 'Vignette', step: '0.05', min: '0', max: '1' })}
  </div>
);

export default {
  id: 'colorGrade',
  label: 'Color Grade',
  category: 'effect',
  defaultProps: { brightness: 1.02, contrast: 1.08, saturate: 1.05, vignette: 0.35 },
  RemotionComponent: ColorGradeRender,
  PropertiesEditor: ColorGradeProps,
};
