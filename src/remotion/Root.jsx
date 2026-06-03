import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import { ASPECT_RATIOS, FPS } from '../editor/types';
import scenes from '../../public/demo/scenes.json';

const ASPECT = '16:9';
const { width, height } = ASPECT_RATIOS[ASPECT];

// Total duration is computed from scenes.json (max endFrame across items).
const defaultDuration = Math.max(
  1,
  scenes.reduce((max, s) => Math.max(max, (s.startFrame ?? 0) + (s.durationFrames ?? 0)), 0)
);

export const Root = () => (
  <>
    <Composition
      id="main"
      component={MainComposition}
      durationInFrames={defaultDuration}
      fps={FPS}
      width={width}
      height={height}
      defaultProps={{ items: scenes, aspectRatio: ASPECT }}
    />
  </>
);
