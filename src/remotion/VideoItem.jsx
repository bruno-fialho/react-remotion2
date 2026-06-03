// VideoItem — renders a single timeline item on the primary video track.
// Composes the underlying media with any effect primitives the user applied.

import { Img, OffthreadVideo, AbsoluteFill, staticFile } from 'remotion';
import { getPrimitive } from '../editor/extension/primitives';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const fill = { width: '100%', height: '100%', objectFit: 'cover' };

// Render by the actual file type, not the item's `type` field. A scene can be
// tagged 'image' / 'animation' / 'broll' for editing rules (e.g. crossfade
// eligibility) while still pointing at a video file — videos play, everything
// else renders as a still image.
const Media = ({ item }) => {
  if (!item.src) return null;
  const src = item.src.startsWith('http') ? item.src : staticFile(item.src);
  return VIDEO_RE.test(item.src) ? (
    <OffthreadVideo src={src} style={fill} muted /> // audio comes from the audio track
  ) : (
    <Img src={src} style={fill} />
  );
};

// Wraps the media in any effect primitives the user applied. Effects compose right-to-left
// (last applied = outermost), so iterating from end to start with React composition gives
// us the right order without recursion.
export const VideoItem = ({ item }) => {
  const effects = item.effects ?? [];
  let tree = (
    <AbsoluteFill>
      <Media item={item} />
    </AbsoluteFill>
  );
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    const primitive = getPrimitive(e.id);
    if (!primitive) continue;
    const { RemotionComponent } = primitive;
    const wrapped = tree;
    tree = (
      <RemotionComponent
        props={e.props ?? primitive.defaultProps}
        ctx={{ durationFrames: item.durationFrames, item }}
      >
        {wrapped}
      </RemotionComponent>
    );
  }
  return tree;
};
