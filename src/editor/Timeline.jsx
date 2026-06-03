// Timeline — two-track view (Visuals above Audio).
//
// Scenes are FIXED: their start and duration come from scenes.json and cannot be
// moved, trimmed, or extended in the editor. This mirrors how TubeGen works — the
// AI lays out the scene timing against the voiceover, and your job is to enhance
// each scene with reusable primitives, not to re-cut the timeline.
//
// What the timeline does support:
//   - Click a clip to select it (its props show in the PropertiesPanel).
//   - Click or drag anywhere to move the playhead (scrub); grab the playhead head too.

import { useRef } from 'react';
import { FPS, TRACK_TYPES, ITEM_TYPES } from './types';
import { itemsOnTrack } from './state';

const PX_PER_FRAME = 4;          // 30 frames (1s) = 120px
const GUTTER = 84;               // width of the sticky track-label column (keep in sync with CSS)

const TRACKS = [
  { id: TRACK_TYPES.V1, label: 'Visuals' },
  { id: TRACK_TYPES.A1, label: 'Audio' },
];

const AUDIO_TYPES = new Set([ITEM_TYPES.VOICEOVER, ITEM_TYPES.SOUNDTRACK]);

const frameToPx = (f) => f * PX_PER_FRAME;
const pxToFrame = (px) => Math.round(px / PX_PER_FRAME);
const basename = (src) => (src ? src.split('/').pop() : '');
const fmtTime = (frames) => {
  const s = frames / FPS;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
};

export default function Timeline({ state, dispatch, currentFrame = 0, onSeek }) {
  const contentRef = useRef(null);

  const totalFrames = Math.max(
    state.durationFrames,
    ...state.items.map((i) => i.startFrame + i.durationFrames),
    FPS * 5
  );
  const contentWidth = frameToPx(totalFrames) + 48;

  // Move the playhead to a pointer x (measured from the content origin, past the gutter).
  const seekFromEvent = (e) => {
    if (!onSeek || !contentRef.current) return;
    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - GUTTER;
    if (x < 0) return; // inside the sticky label column — ignore
    onSeek(Math.max(0, Math.min(totalFrames, pxToFrame(x))));
  };
  const endScrub = () => {
    window.removeEventListener('pointermove', seekFromEvent);
    window.removeEventListener('pointerup', endScrub);
  };
  const startScrub = (e) => {
    seekFromEvent(e);
    window.addEventListener('pointermove', seekFromEvent);
    window.addEventListener('pointerup', endScrub);
  };
  // Clicking/dragging empty timeline space deselects and scrubs.
  const onSurfacePointerDown = (e) => {
    dispatch({ type: 'SELECT_ITEM', id: null });
    startScrub(e);
  };
  // Clicking a clip selects it and scrubs to that point (clips can't be moved).
  const onClipPointerDown = (e, item) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_ITEM', id: item.id });
    startScrub(e);
  };
  // Grabbing the playhead head scrubs without changing the selection.
  const onPlayheadPointerDown = (e) => {
    e.stopPropagation();
    startScrub(e);
  };

  const ticks = [];
  for (let f = 0; f <= totalFrames; f += FPS) ticks.push(f);

  return (
    <div className="timeline">
      <div className="tl-scroll">
        <div
          className="tl-content"
          ref={contentRef}
          style={{ width: contentWidth }}
          onPointerDown={onSurfacePointerDown}
        >
          {/* Playhead — spans the ruler + lanes; grab the head to drag it */}
          <div className="tl-playhead" style={{ left: GUTTER + frameToPx(currentFrame) }}>
            <div className="tl-playhead-head" onPointerDown={onPlayheadPointerDown} />
          </div>

          {/* Ruler (click anywhere on the timeline to scrub) */}
          <div className="tl-ruler" style={{ width: contentWidth }}>
            <div className="tl-gutter" />
            <div className="tl-lane tl-ruler-lane">
              {ticks.map((f) => (
                <div key={f} className="tl-tick" style={{ left: frameToPx(f) }}>
                  <span>{fmtTime(f)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tracks */}
          {TRACKS.map((track) => {
            const items = itemsOnTrack(state, track.id);
            return (
              <div key={track.id} className="tl-track">
                <div className="tl-gutter tl-track-label">{track.label}</div>
                <div className="tl-lane">
                  {items.map((item) => {
                    const isAudio = AUDIO_TYPES.has(item.type);
                    const selected = item.id === state.selectedItemId;
                    const label = basename(item.src) || item.type;
                    return (
                      <div
                        key={item.id}
                        className={`tl-clip${isAudio ? ' is-audio' : ''}${
                          selected ? ' is-selected' : ''
                        }`}
                        style={{
                          left: frameToPx(item.startFrame),
                          width: frameToPx(item.durationFrames),
                        }}
                        onPointerDown={(e) => onClipPointerDown(e, item)}
                        title={label}
                      >
                        <span className="tl-clip-label">
                          {isAudio ? '♪ ' : ''}
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
