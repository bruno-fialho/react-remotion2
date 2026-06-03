import { Audio, Sequence, staticFile } from 'remotion';

export const AudioTrack = ({ item }) => {
  const src = item.src?.startsWith('http') ? item.src : staticFile(item.src);
  return (
    <Sequence from={item.startFrame} durationInFrames={item.durationFrames}>
      <Audio src={src} volume={item.volume ?? 1} />
    </Sequence>
  );
};
