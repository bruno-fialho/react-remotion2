// Overlay: title card — a full-frame opening/section title with an optional kicker and
// subtitle. Spring-driven so the type settles with weight instead of a linear slide, and
// it fades out cleanly so it can sit over the first scene of any project.
//
// Overlay, not scene type: it renders on top of whatever media is underneath at its frame
// range (it does not replace the picture), so you can title over a live shot.

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { PALETTE, FONT } from '../theme';

/**
 * @typedef {Object} TitleCardProps
 * @property {string} title
 * @property {string} kicker      Small label above the title (e.g. "EPISODE 1").
 * @property {string} subtitle
 * @property {string} textColor
 * @property {string} accentColor Colour of the kicker + underline.
 * @property {'left'|'center'} align
 * @property {string} fontFamily
 * @property {number} scrim       0..1 darkening behind the text for legibility.
 * @property {number} exitFrames  Fade-out length at the end of the item.
 */

/** @param {{ props: TitleCardProps, ctx: { durationFrames: number } }} _ */
const TitleCardRender = ({ props, ctx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { durationFrames } = ctx;
  const {
    title = 'Title',
    kicker = '',
    subtitle = '',
    textColor = PALETTE.paper,
    accentColor = PALETTE.accent,
    align = 'center',
    fontFamily = FONT,
    scrim = 0.45,
    exitFrames = 18,
  } = props;

  // Spring entrance: rise + settle.
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const rise = interpolate(enter, [0, 1], [40, 0]);
  const exit = interpolate(frame, [durationFrames - exitFrames, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = enter * exit;
  const centered = align === 'center';

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: PALETTE.ink, opacity: scrim * exit }} />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: centered ? 'center' : 'flex-start',
          padding: centered ? 0 : '0 96px',
          textAlign: centered ? 'center' : 'left',
          fontFamily,
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div style={{ maxWidth: '78%' }}>
          {kicker ? (
            <div
              style={{
                color: accentColor,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div style={{ color: textColor, fontSize: 84, fontWeight: 800, lineHeight: 1.04 }}>
            {title}
          </div>
          <div
            style={{
              height: 5,
              width: 96,
              background: accentColor,
              margin: centered ? '28px auto 0' : '28px 0 0',
              borderRadius: 4,
            }}
          />
          {subtitle ? (
            <div style={{ color: textColor, opacity: 0.82, fontSize: 32, marginTop: 24, fontWeight: 500 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleCardProps = ({ props, onChange }) => {
  const set = (k) => (e) => onChange({ ...props, [k]: e.target.value });
  const setN = (k) => (e) => onChange({ ...props, [k]: parseFloat(e.target.value) });
  return (
    <div className="props-form">
      <label>Title<input type="text" value={props.title} onChange={set('title')} /></label>
      <label>Kicker<input type="text" value={props.kicker} onChange={set('kicker')} /></label>
      <label>Subtitle<input type="text" value={props.subtitle} onChange={set('subtitle')} /></label>
      <label>Text color<input type="color" value={props.textColor} onChange={set('textColor')} /></label>
      <label>Accent color<input type="color" value={props.accentColor} onChange={set('accentColor')} /></label>
      <label>
        Align
        <select value={props.align} onChange={set('align')}>
          <option value="center">Center</option>
          <option value="left">Left</option>
        </select>
      </label>
      <label>Scrim<input type="range" min="0" max="1" step="0.05" value={props.scrim} onChange={setN('scrim')} /></label>
      <label>Exit frames<input type="number" min="1" max="60" value={props.exitFrames} onChange={setN('exitFrames')} /></label>
    </div>
  );
};

export default {
  id: 'titleCard',
  label: 'Title Card',
  category: 'overlay',
  defaultProps: {
    title: 'Title',
    kicker: '',
    subtitle: '',
    textColor: PALETTE.paper,
    accentColor: PALETTE.accent,
    align: 'center',
    fontFamily: FONT,
    scrim: 0.45,
    exitFrames: 18,
  },
  RemotionComponent: TitleCardRender,
  PropertiesEditor: TitleCardProps,
};
