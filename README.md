# 🐧 TubeGen AI — Frontend / Remotion Code Challenge

> You have **24 hours**. Build something that makes a creator say *"I need this."*

---

## What is TubeGen AI?

TubeGen AI is a full-stack AI video creation platform for YouTube and social media creators — a co-pilot that takes a raw idea and produces a fully edited, publish-ready video in minutes.

| | Feature | What it does |
|:---:|---|---|
| 📝 | **Scriptwriting** | AI writes viral scripts with hooks, structure, and CTAs |
| 🎙️ | **Voiceover** | Realistic AI voices via ElevenLabs — cloned or stock |
| 🎨 | **Visuals** | AI-generated B-roll, thumbnails, and scene imagery |
| 💬 | **Captions** | Auto-synced animated subtitles |
| 🧑‍🎤 | **Avatars** | Consistent AI characters across every video |
| 🎵 | **Music** | Royalty-free AI background tracks |
| 🎬 | **Editor** | In-browser timeline editor to assemble everything |
| 📊 | **Analytics** | Predicted views, CTR, and revenue — before you publish |

Creators go from *"I have an idea"* to a fully produced video — no camera, no mic, no editing software.

---

## The Challenge

Build a **30–60 second animated video** using Remotion that showcases a fictional TubeGen AI workflow.

You're not building a working app. You're building a Remotion video that *looks like* a real app being used — a product demo video, not working software.

> **We care more about quality, polish, architecture, and product sense than raw completeness.**
>
> **4 beautiful, well-architected scenes beat 6 rushed ones.** Build fewer things and build them well.

---

## Scope

### ✅ Required — implement at least 4 of these

| # | Scene | What to show |
|---|---|---|
| 1 | **📺 Channel / Idea Input** | User pastes `https://youtube.com/@MrBeast` → loading state → channel stats revealed (name, subs, niche, top topics) |
| 2 | **💡 Viral Title Generation** | AI generates 5 video ideas → staggered cards appear → one gets selected with a viral score badge |
| 3 | **📝 Script Writing** | Typewriter animation writes the script section by section: `[HOOK]` `[INTRO]` `[MAIN]` `[CTA]` → word count on completion |
| 4 | **🚀 Export & Publish** | "Video ready!" success state → YouTube-style thumbnail → predicted analytics → Export button with glow/pulse → TubeGen outro |

### ⭐ Bonus — extra credit if time allows

| # | Scene | What to show |
|---|---|---|
| 5 | **🎙️ Asset Generation** | 4-track production pipeline (Voiceover · Visuals · Captions · Music) with staggered progress bars, waveform/EQ animations, and a final "All ready ✓" state |
| 6 | **✂️ Video Editor** | Timeline UI — video preview with caption overlay, animated playhead scrubbing across clips, track layout (Video · Voice · Music · Captions) |

---

## Technical Requirements

**Must use:**

- ⚛️ React + 🎬 Remotion
- 🔷 TypeScript (preferred, not required)
- Reusable, DRY components
- Consistent design system — colors, spacing, typography, animation style
- At least 4 distinct animated scenes
- Text, UI panels, transitions, and motion effects

**Good to have:**

- AI generation loading states
- `spring()` physics for natural motion (not just linear `interpolate`)
- Staggered list animations
- Smooth scene transitions (fade to black, cross-dissolve)
- 16:9 (1920×1080) or 9:16 (1080×1920) format

---

## Rules

> Read these before you start.

- **Remotion is required.** The video must be rendered from code — not exported from Figma, ScreenFlow, or any video editor. Submissions without a working `npm run render` will be disqualified.
- **Mock data is fine.** No real APIs needed. All data in `src/mock/index.ts` is yours to use or replace.
- **External UI libraries are allowed**, but the core animation logic and composition timing must be your own work.
- **AI tools are allowed**, but you must understand and be able to explain every line of your code in the Loom walkthrough. If you can't explain it, it doesn't count.

---

## Getting Started

```bash
# 1. Clone this repo
git clone https://github.com/amplifyit-io/tubegen-remotion-challenge.git
cd tubegen-remotion-challenge/starter

# 2. Install dependencies
npm install

# 3. Open Remotion Studio — live preview with frame scrubbing
npm start

# 4. Render the final video → out/tubegen.mp4
npm run render
```

All 6 scene stubs are wired into `src/Video.tsx` and compile immediately. Start by reading `Video.tsx` to understand the composition structure, then implement your 4+ scenes.

---

## Project Structure

```
starter/
├── src/
│   ├── Video.tsx              # 🎬 Main composition — adjust scene durations here
│   ├── Root.tsx               # Registers the composition
│   ├── index.ts               # Entry point — do not modify
│   │
│   ├── design/tokens.ts       # 🎨 Colors, typography, spacing, spring configs
│   ├── mock/index.ts          # 📦 All mock data — channel, ideas, script, assets
│   ├── components/            # 🧩 Build your reusable animated primitives here
│   └── scenes/
│       ├── Scene1Input.tsx    # 📺 Required
│       ├── Scene2Ideas.tsx    # 💡 Required
│       ├── Scene3Script.tsx   # 📝 Required
│       ├── Scene4Assets.tsx   # 🎙️ Bonus
│       ├── Scene5Editor.tsx   # ✂️  Bonus
│       └── Scene6Export.tsx   # 🚀 Required
```

**Components worth building** (reusable across scenes — this is where architecture points are won):

| Component | Purpose |
|---|---|
| `<AnimatedEntry>` | Slide-in + fade wrapper with a `delay` prop |
| `<TypewriterText>` | Renders text char-by-char using `interpolate` |
| `<ProgressBar>` | Animated fill bar driven by `startFrame` / `endFrame` |
| `<GlassPanel>` | Consistent glassmorphism card container |
| `<Badge>` | Colored tag — viral score, status, AI confidence |
| `<Background>` | Dark animated background with gradient orbs |

---

## Remotion Essentials

The core primitives — everything else builds on these:

| Hook / Component | What it does | Docs |
|---|---|:---:|
| `useCurrentFrame()` | Returns current frame — resets to 0 inside each `<Series.Sequence>` | [→](https://www.remotion.dev/docs/use-current-frame) |
| `useVideoConfig()` | Returns `fps`, `width`, `height`, `durationInFrames` | [→](https://www.remotion.dev/docs/use-video-config) |
| `interpolate()` | Maps a frame range to a value range — like CSS keyframes | [→](https://www.remotion.dev/docs/interpolate) |
| `spring()` | Physics-based spring — always prefer over raw `interpolate` for UI motion | [→](https://www.remotion.dev/docs/spring) |
| `<Sequence>` | Renders a component at a specific frame offset | [→](https://www.remotion.dev/docs/sequence) |
| `<Series>` | Chains scenes end-to-end automatically | [→](https://www.remotion.dev/docs/series) |
| `<AbsoluteFill>` | Full-bleed absolute container — use as root of every scene | [→](https://www.remotion.dev/docs/absolute-fill) |
| `Easing` | Easing curves for `interpolate` — cubic, elastic, bounce… | [→](https://www.remotion.dev/docs/easing) |

**The patterns you'll use in almost every scene:**

```tsx
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();   // 0 at scene start inside <Series.Sequence>
const { fps } = useVideoConfig();

// — Slide up + fade in, starting at frame 20 —
const progress  = spring({ frame: frame - 20, fps, config: { stiffness: 80, damping: 20 } });
const translateY = interpolate(progress, [0, 1], [40, 0]);
const opacity    = interpolate(frame, [20, 40], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// — Stagger a list: each item enters 8 frames after the previous —
items.map((item, i) => {
  const p = spring({ frame: frame - 30 - i * 8, fps, config: { stiffness: 100, damping: 18 } });
  // use p for translateY, scale, opacity…
});

// — Deterministic organic motion (use instead of Math.random) —
const waveHeight = Math.abs(Math.sin(frame * 0.12 + index * 0.7)) * 40;
```

**Common mistakes to avoid:**

| ❌ Don't | ✅ Do instead |
|---|---|
| `Math.random()` in render | `Math.sin(frame * n + index * n)` — deterministic |
| `useEffect` / `setTimeout` for animation | Derive all motion from `frame` |
| `interpolate` without clamp | Always pass `extrapolateLeft/Right: 'clamp'` |
| Linear easing everywhere | Use `spring()` for UI elements — it looks natural |
| Fade only (opacity) for entries | Combine fade + translate for depth |

**More resources:** [Docs](https://www.remotion.dev/docs) · [Showcase](https://www.remotion.dev/showcase) · [Discord](https://remotion.dev/discord)

---

## Deliverables

Reply to this email thread with all three:

### 1. 🔗 GitHub repo
Public. Your implementation lives here.

### 2. 🎥 Rendered video
MP4 — upload to Google Drive, YouTube (unlisted), or Loom.

The video must be rendered with `npm run render`. Include the command output in your README if you want to be thorough.

### 3. 📹 Loom walkthrough — max 5 minutes, required

Your Loom must cover these four things:

1. **Show the final video playing** — screen share the rendered MP4
2. **Walk through your component structure** — how did you organize scenes and shared components?
3. **Explain one animation or timing decision** — why did you use `spring` vs `interpolate` somewhere? What spring config did you choose and why?
4. **Name one tradeoff you made** — what did you cut or simplify because of the 24h limit, and what would you have done differently?

> We use the Loom to verify that you understand the code you submitted. Candidates who can't explain their own components don't move forward, regardless of how the video looks.

### Your README should include:
- Setup and render instructions
- Your approach to design and animation
- Tradeoffs made under time pressure
- What you'd improve given more time

---

## Evaluation

| Category | Weight |
|---|---:|
| 🎬 Remotion implementation | 25% |
| ✨ Visual polish / motion design | 25% |
| ⚛️ React architecture / reusable components | 20% |
| 🧠 Product sense / TubeGen workflow understanding | 15% |
| 🔷 Code quality / TypeScript / organization | 10% |
| 📄 README + Loom explanation | 5% |

---

## Time Limit

**24 hours** from when you receive this.

This is time-boxed by design. We want to see how you prioritize and ship under real constraints — not how much you can build in a week.

**If time runs short:** finish fewer scenes and finish them well. A polished 4-scene video with clean architecture is a better submission than a 6-scene video with broken animations and messy components.

---

## Questions?

Reply to the email thread. We respond fast.

Good luck — we're excited to see what you build. 🐧
