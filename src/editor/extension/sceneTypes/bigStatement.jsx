// Scene type: big statement — a full-frame text moment laid *over* the footage. The
// underlying scene stays visible; a soft scrim behind the words keeps them legible on any
// shot. Words reveal in a staggered spring so a key line lands with emphasis, and an
// `accent` word can be coloured to punch the operative phrase. Use it for a hook, a
// pull-quote, or a payoff beat.
//
// Scene types are the registry's fourth category and ship no worked example, so this also
// proves that seam: it's an O1 item with `primitiveId`/`primitiveProps`, rendered through
// MainComposition's overlay branch with zero core changes.

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { PALETTE, FONT } from '../theme';

/**
 * @typedef {Object} BigStatementProps
 * @property {string} text         The full line. Split on spaces for the stagger.
 * @property {string} accent       Word(s) to colour with `accentColor` (case-insensitive).
 * @property {string} textColor
 * @property {string} accentColor
 * @property {number} scrim        0 = none .. 1 = strong darkening behind the words.
 * @property {string} scrimColor   Colour of the scrim (default near-black).
 * @property {number} stagger      Frames between each word's entrance.
 * @property {number} enterFrames  Fade-in length of the whole overlay.
 * @property {number} exitFrames   Fade-out length of the whole overlay.
 * @property {string} fontFamily
 */

const isAccent = (word, accent) => {
  if (!accent) return false;
  const clean = (s) => s.toLowerCase().replace(/[^\w]/g, '');
  const set = new Set(accent.split(/\s+/).map(clean).filter(Boolean));
  return set.has(clean(word));
};

/** @param {{ props: BigStatementProps, ctx: { durationFrames: number } }} _ */
const BigStatementRender = ({ props, ctx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { durationFrames } = ctx;
  const {
    text = 'Big statement',
    accent = '',
    textColor = PALETTE.paper,
    accentColor = PALETTE.accent,
    scrim = 0.5,
    scrimColor = PALETTE.ink,
    stagger = 4,
    enterFrames = 10,
    exitFrames = 16,
    fontFamily = FONT,
  } = props;

  const words = text.split(/\s+/).filter(Boolean);

  // The footage stays visible the whole time. The scrim + words fade in and out together
  // so the overlay never pops; the per-word spring adds the staggered emphasis on top.
  const fadeIn = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationFrames - exitFrames, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ fontFamily, opacity }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 55% at 50% 50%, ${scrimColor} 0%, transparent 72%)`,
          opacity: scrim,
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 10%' }}>
        <div style={{ textAlign: 'center', fontSize: 88, fontWeight: 800, lineHeight: 1.1, maxWidth: '90%' }}>
          {words.map((word, i) => {
            const enter = spring({
              frame: frame - i * stagger,
              fps,
              config: { damping: 200, mass: 0.7 },
            });
            const y = interpolate(enter, [0, 1], [28, 0]);
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: 'inline-block',
                  marginRight: '0.28em',
                  color: isAccent(word, accent) ? accentColor : textColor,
                  opacity: enter,
                  transform: `translateY(${y}px)`,
                  textShadow: '0 2px 12px rgba(0,0,0,0.55)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BigStatementProps = ({ props, onChange }) => {
  const set = (k) => (e) => onChange({ ...props, [k]: e.target.value });
  const setN = (k) => (e) => onChange({ ...props, [k]: parseFloat(e.target.value) });
  return (
    <div className="props-form">
      <label>Text<input type="text" value={props.text} onChange={set('text')} /></label>
      <label>Accent word(s)<input type="text" value={props.accent} onChange={set('accent')} /></label>
      <label>Text color<input type="color" value={props.textColor} onChange={set('textColor')} /></label>
      <label>Accent color<input type="color" value={props.accentColor} onChange={set('accentColor')} /></label>
      <label>Scrim<input type="range" min="0" max="1" step="0.05" value={props.scrim} onChange={setN('scrim')} /></label>
      <label>Scrim color<input type="color" value={props.scrimColor} onChange={set('scrimColor')} /></label>
      <label>Stagger (frames)<input type="number" min="0" max="20" value={props.stagger} onChange={setN('stagger')} /></label>
      <label>Enter frames<input type="number" min="1" max="60" value={props.enterFrames} onChange={setN('enterFrames')} /></label>
      <label>Exit frames<input type="number" min="1" max="60" value={props.exitFrames} onChange={setN('exitFrames')} /></label>
    </div>
  );
};

export default {
  id: 'bigStatement',
  label: 'Big Statement',
  category: 'sceneType',
  defaultProps: {
    text: 'Big statement',
    accent: '',
    textColor: PALETTE.paper,
    accentColor: PALETTE.accent,
    scrim: 0.5,
    scrimColor: PALETTE.ink,
    stagger: 4,
    enterFrames: 10,
    exitFrames: 16,
    fontFamily: FONT,
  },
  RemotionComponent: BigStatementRender,
  PropertiesEditor: BigStatementProps,
};
