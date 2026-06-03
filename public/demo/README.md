# Demo Project Assets

This is the demo project you'll edit. Files referenced by `scenes.json`:

```
assets/voiceover.mp3               narration
assets/visuals/001.mp4 … 012.mp4   visual clips (a mix of animation and stock footage)
assets/script.txt                  the voiceover script
scenes.json                        timeline data (loaded by the editor on mount)
manifest.json                      generated from assets/ on dev/build — do not edit by hand
```

You can **add** assets here (e.g. reference frames, additional clips) and reference them from
your new primitives. New files under `assets/visuals/` and `assets/` are picked up by the Assets
sidebar on the next `npm run dev` (the manifest regenerates automatically).

Please don't modify or delete the existing assets — they're the baseline every candidate works from.
