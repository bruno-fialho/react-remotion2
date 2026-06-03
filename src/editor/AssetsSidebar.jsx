// AssetsSidebar — left-hand pane. Tabs for the demo asset library and the primitive
// library. The asset list comes from /demo/manifest.json (generated at dev/build time
// by scripts/gen-manifest.mjs), so nothing is hardcoded — drop a file into
// public/demo/assets and it shows up here on the next dev start.
//
// Tabs:
//   - Visuals  — clips on disk (browse the demo bundle).
//   - Audio    — voiceover (and any other audio).
//   - Effects  — primitives from the registry; clicking one opens a modal that asks
//                which scenes to apply it to.

import { useEffect, useState } from 'react';
import { TRACK_TYPES } from './types';
import { itemsOnTrack } from './state';
import { getPrimitivesByCategory } from './extension/primitives';

const TABS = ['Visuals', 'Audio', 'Effects'];
const basename = (src) => (src ? src.split('/').pop() : '');

// A single asset card. Loads the media metadata to show its real duration.
function AssetCard({ asset, kind }) {
  const [duration, setDuration] = useState(null);

  return (
    <div className="asset-card">
      {kind === 'visual' ? (
        <video
          className="asset-thumb"
          src={`${asset.src}#t=0.1`}
          muted
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      ) : (
        <div className="asset-thumb asset-thumb-audio">♪</div>
      )}
      {kind === 'audio' && (
        <audio
          src={asset.src}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}
      <div className="asset-meta">
        <span className="asset-name" title={asset.name}>
          {asset.name}
        </span>
        <span className="asset-dur">{duration ? `${duration.toFixed(1)}s` : '…'}</span>
      </div>
    </div>
  );
}

export default function AssetsSidebar({ state, dispatch }) {
  const [tab, setTab] = useState('Visuals');
  const [manifest, setManifest] = useState({ visuals: [], audio: [] });
  const [modalEffect, setModalEffect] = useState(null); // primitive awaiting scene pick
  const [picked, setPicked] = useState(() => new Set());

  useEffect(() => {
    fetch('/demo/manifest.json')
      .then((r) => (r.ok ? r.json() : { visuals: [], audio: [] }))
      .then((m) => setManifest({ visuals: m.visuals ?? [], audio: m.audio ?? [] }))
      .catch(() => {});
  }, []);

  // Scenes the effect can target = items on the Visuals track, in timeline order.
  const scenes = itemsOnTrack(state, TRACK_TYPES.V1);

  // A primitive may declare `canApply(scene, nextScene)` to restrict where it's
  // valid (e.g. crossfade only at an image→image boundary). No predicate = anywhere.
  const eligible = (primitive, i) =>
    primitive.canApply ? !!primitive.canApply(scenes[i], scenes[i + 1]) : true;
  const eligibleIds = (primitive) =>
    scenes.filter((_, i) => eligible(primitive, i)).map((s) => s.id);

  const openEffectModal = (primitive) => {
    setModalEffect(primitive);
    setPicked(new Set(eligibleIds(primitive))); // default: all eligible scenes
  };
  const closeModal = () => setModalEffect(null);

  const togglePick = (id) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const applyEffectToPicked = () => {
    scenes.forEach((scene) => {
      if (!picked.has(scene.id)) return;
      if (modalEffect.category === 'transition') {
        dispatch({
          type: 'SET_TRANSITION',
          itemId: scene.id,
          transition: { id: modalEffect.id, props: { ...modalEffect.defaultProps } },
        });
      } else {
        dispatch({
          type: 'APPLY_EFFECT',
          itemId: scene.id,
          primitiveId: modalEffect.id,
          props: { ...modalEffect.defaultProps },
        });
      }
    });
    closeModal();
  };

  return (
    <aside className="assets-sidebar">
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab${tab === t ? ' is-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Visuals' && (
        <div className="asset-grid">
          {manifest.visuals.length === 0 && <p className="muted">No visuals found.</p>}
          {manifest.visuals.map((a) => (
            <AssetCard key={a.src} asset={a} kind="visual" />
          ))}
        </div>
      )}

      {tab === 'Audio' && (
        <div className="asset-grid">
          {manifest.audio.length === 0 && <p className="muted">No audio found.</p>}
          {manifest.audio.map((a) => (
            <AssetCard key={a.src} asset={a} kind="audio" />
          ))}
        </div>
      )}

      {tab === 'Effects' && (
        <div className="effects-list">
          <p className="muted">Pick an effect, then choose which scenes to apply it to.</p>
          {['effect', 'transition'].flatMap((cat) =>
            getPrimitivesByCategory(cat).map((p) => (
              <button key={p.id} className="effect-item" onClick={() => openEffectModal(p)}>
                <span className="effect-cat">{p.category}</span>
                <span className="effect-label">{p.label}</span>
              </button>
            ))
          )}
        </div>
      )}

      {modalEffect && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h3>Apply “{modalEffect.label}”</h3>
              <span className="muted">{picked.size} selected</span>
            </header>

            {modalEffect.category === 'transition' && (
              <p className="muted">
                Crossfade only applies at the end of an image scene whose next scene is
                also an image — other scenes are disabled.
              </p>
            )}

            <div className="modal-actions-top">
              <button onClick={() => setPicked(new Set(eligibleIds(modalEffect)))}>Select all</button>
              <button onClick={() => setPicked(new Set())}>Clear</button>
            </div>

            <ul className="scene-list">
              {scenes.length === 0 && <li className="muted">No scenes on the Visuals track.</li>}
              {scenes.map((scene, i) => {
                const ok = eligible(modalEffect, i);
                return (
                  <li key={scene.id}>
                    <label className={ok ? '' : 'is-disabled'}>
                      <input
                        type="checkbox"
                        disabled={!ok}
                        checked={picked.has(scene.id)}
                        onChange={() => togglePick(scene.id)}
                      />
                      <span className="scene-idx">{i + 1}</span>
                      <span className="scene-name">{basename(scene.src) || scene.id}</span>
                      {!ok && <span className="scene-note">not eligible</span>}
                    </label>
                  </li>
                );
              })}
            </ul>

            <footer className="modal-foot">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                disabled={picked.size === 0}
                onClick={applyEffectToPicked}
              >
                Apply to {picked.size} scene{picked.size === 1 ? '' : 's'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </aside>
  );
}
