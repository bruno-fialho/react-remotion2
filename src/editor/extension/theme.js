// Shared, project-agnostic design tokens for primitives.
//
// These are deliberately generic — neutral palette, sensible easing curves, a system
// font stack. A primitive imports from here instead of inlining magic numbers, so the
// look stays consistent across primitives and nothing is tied to the demo project.
//
// Easing curves are returned as functions ready to pass to interpolate({ easing }).

import { Easing } from 'remotion';

export const EASING = {
  // General-purpose ease-in-out. Good default for camera moves.
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  // Decelerate — fast start, soft landing. Good for things sliding/entering.
  easeOut: Easing.bezier(0.16, 1, 0.3, 1),
  // Gentle accelerate-in — good for exits.
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  linear: Easing.linear,
};

// Resolve a string key (as stored in serializable props) to an easing function.
export const resolveEasing = (key) => EASING[key] ?? EASING.standard;

export const PALETTE = {
  ink: '#0B0B0F', // near-black backgrounds
  paper: '#FFFFFF', // primary text on dark
  muted: 'rgba(255,255,255,0.7)',
  accent: '#FFB020', // single warm accent
  scrim: 'rgba(0,0,0,0.55)', // overlay backdrop
};

export const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
