import GameEngine from '../components/GameEngine';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { useStore } from '../state/stateManagement';
import { useEffect } from 'react';

const SCALE = 100;

export default function GameContainer({ isPlayerHuman }) {
  const { screenHeight, screenWidth } = useStore(state => state.gameSettings);
  const { pauseGame } = useStore(state => state.actions);

  useEffect(() => {
    window.addEventListener('blur', pauseGame);
    return () => window.removeEventListener('blur', pauseGame);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        width: `${screenWidth * SCALE}px`,
        height: `${screenHeight * SCALE}px`,
      }}
    >
      <Canvas
        orthographic
        camera={{
          zoom: SCALE,
          position: [0, 0, 1],
          top: screenHeight / 2,
          bottom: -screenHeight / 2,
          left: -screenWidth / 2,
          right: screenWidth / 2,
        }}
      >
        <GameEngine isPlayerHuman={isPlayerHuman} />
        <Stats />
      </Canvas>
    </div>
  );
}
