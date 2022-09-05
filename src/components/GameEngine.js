import React, { useEffect } from 'react';
import { Bird } from '../game-elements/Bird';
import { Pipe } from '../game-elements/Pipe';
import { useStore } from '../game-model/store';
import { usePlayerControl } from '../hooks/controlHooks';
import { GameVisor } from './GameVisor';

export default function GameEngine() {
  const { actions, score, runState, bird, pipes, initialized } = useStore();

  function handleJump(event) {
    if (!event || event.code === 'Space') {
      actions.jump();
    }
  }
  usePlayerControl(handleJump);

  // Use the enter key to start/restart the game
  function handleEnter(event) {
    if (event.code === 'Enter') {
      actions.start();
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleEnter);
    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, []);

  // Initialize the model
  useEffect(() => {
    actions.init();
  }, []);

  // NO REFS?!?! Thanks Zustand!
  return (
    <>
      <GameVisor
        score={score}
        runState={runState}
      />
      {initialized ? (
        <>
          <Bird position={bird.position} />
          {pipes.map((el, index) => (
            <Pipe
              key={index}
              position={pipes[index].position}
            />
          ))}
        </>
      ) : null}
      <BackgroundPanel />
    </>
  );
}

function BackgroundPanel() {
  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry args={[8, 4.5, 1, 1]} />
      <meshBasicMaterial
        // wireframe
        color={'skyblue'}
      />
    </mesh>
  );
}
