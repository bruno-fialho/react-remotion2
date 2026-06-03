// Generates public/demo/manifest.json by scanning the demo asset folders.
// Runs automatically before `npm run dev` / `npm run build` (see package.json),
// so the Assets sidebar stays in sync as the demo bundle changes — nothing is
// hardcoded in the UI.

import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demoDir = join(root, 'public/demo');
const assetsDir = join(demoDir, 'assets');
const visualsDir = join(assetsDir, 'visuals');

const numeric = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const list = (dir, re, toSrc) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => re.test(f))
        .sort(numeric)
        .map((name) => ({ name, src: toSrc(name) }))
    : [];

const manifest = {
  visuals: list(visualsDir, /\.(mp4|webm|mov)$/i, (n) => `/demo/assets/visuals/${n}`),
  audio: list(assetsDir, /\.(mp3|wav|m4a)$/i, (n) => `/demo/assets/${n}`),
};

writeFileSync(join(demoDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest.json: ${manifest.visuals.length} visuals, ${manifest.audio.length} audio`);
