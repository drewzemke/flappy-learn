import './App.css';
import GameEngine from './components/GameEngine';
import { Canvas } from '@react-three/fiber';
import { GameConstants } from './game-model/GameConstants';

const SCALE = 100;

function App() {
  return (
    <div
      style={{
        width: `${GameConstants.SCREEN_WIDTH * SCALE}px`,
        height: `${GameConstants.SCREEN_HEIGHT * SCALE}px`
      }}
    >
      <Canvas
        orthographic
        camera={{
          zoom: SCALE,
          position: [0, 0, 1],
          top: GameConstants.SCREEN_HEIGHT / 2,
          bottom: -GameConstants.SCREEN_HEIGHT / 2,
          left: -GameConstants.SCREEN_WIDTH / 2,
          right: GameConstants.SCREEN_WIDTH / 2
        }}
      >
        <color
          attach='background'
          args={['black']}
        />
        <GameEngine />;
      </Canvas>
    </div>
  );
}

export default App;
