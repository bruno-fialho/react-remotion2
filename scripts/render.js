// Render the demo project headless to out/final.mp4.
//
// Usage:
//   npm run render
//
// What it does: hands off to `remotion render` (declared in package.json scripts)
// with scenes.json passed as inputProps. Equivalent to running the CLI directly:
//
//   npx remotion render src/remotion/index.js main out/final.mp4 \
//     --props='public/demo/scenes.json'
//
// This script is here as a placeholder in case the candidate wants to add
// pre/post-render logic (e.g., transcode for web delivery, ffmpeg trim).

import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('out', { recursive: true });

// Root.jsx imports scenes.json statically and passes it via defaultProps, so we
// don't need to pass --props here. If you want to render a different project,
// either edit Root.jsx's import or pass --props with a full JSON object matching
// { items, aspectRatio }.
const cmd = [
  'npx', 'remotion', 'render',
  'src/remotion/index.js',
  'main',
  'out/final.mp4',
].join(' ');

console.log('>', cmd);
execSync(cmd, { stdio: 'inherit' });
