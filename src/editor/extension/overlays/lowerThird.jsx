// Overlay: lower-third title card.
// Worked example — fork this when adding new overlay primitives (callouts, title cards,
// pull-quotes, stat boxes, etc.).
//
// Overlays are first-class timeline items: they appear on their own row, have their own
// start/end time, and render on top of whatever video/image is underneath at the same
// frame range. They do NOT wrap an underlying media item — for that, use the 'effect'
// category.

import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

const LowerThirdRender = ({ props, ctx }) => {
  const frame = useCurrentFrame();
  const { durationFrames } = ctx;
  const {
    title = 'Title',
    subtitle = '',
    backgroundColor = 'rgba(0,0,0,0.7)',
    textColor = '#FFFFFF',
    fontFamily = 'Inter, system-ui, sans-serif',
    enterFrames = 12,
    exitFrames = 12,
  } = props;

  const enter = interpolate(frame, [0, enterFrames], [0, 1], { extrapolateRight: 'clamp' });
  const exit = interpolate(
    frame,
    [durationFrames - exitFrames, durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = Math.min(enter, exit);
  const translateX = interpolate(enter, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 60, bottom: 80,
          padding: '18px 28px',
          background: backgroundColor,
          color: textColor,
          fontFamily,
          borderLeft: `4px solid ${textColor}`,
          opacity,
          transform: `translateX(${translateX}px)`,
          maxWidth: '60%',
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 22, opacity: 0.85, marginTop: 4 }}>{subtitle}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const LowerThirdProps = ({ props, onChange }) => {
  const set = (k) => (e) => onChange({ ...props, [k]: e.target.value });
  const setN = (k) => (e) => onChange({ ...props, [k]: parseInt(e.target.value, 10) || 0 });
  return (
    <div className="props-form">
      <label>Title<input type="text" value={props.title} onChange={set('title')} /></label>
      <label>Subtitle<input type="text" value={props.subtitle} onChange={set('subtitle')} /></label>
      <label>Background<input type="text" value={props.backgroundColor} onChange={set('backgroundColor')} /></label>
      <label>Text color<input type="color" value={props.textColor} onChange={set('textColor')} /></label>
      <label>Enter frames<input type="number" min="1" max="60" value={props.enterFrames} onChange={setN('enterFrames')} /></label>
      <label>Exit frames<input type="number" min="1" max="60" value={props.exitFrames} onChange={setN('exitFrames')} /></label>
    </div>
  );
};

export default {
  id: 'lowerThird',
  label: 'Lower Third',
  category: 'overlay',
  defaultProps: {
    title: 'Title',
    subtitle: '',
    backgroundColor: 'rgba(0,0,0,0.7)',
    textColor: '#FFFFFF',
    fontFamily: 'Inter, system-ui, sans-serif',
    enterFrames: 12,
    exitFrames: 12,
  },
  RemotionComponent: LowerThirdRender,
  PropertiesEditor: LowerThirdProps,
};
