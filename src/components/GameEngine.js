import React, { useEffect } from 'react';
import { useFlappyNeuralNetwork } from '../ai/FlappyNN';
import { Bird } from '../game-elements/Bird';
import { Pipe } from '../game-elements/Pipe';
import { useStore } from '../game-model/store';
import { usePlayerControl } from '../hooks/controlHooks';
import { GameVisor } from './GameVisor';

export default function GameEngine() {
  const { actions, score, round, runState, birds, pipes, initialized } =
    useStore();

  // Allow the player to jump using the spacebar
  // function handleJump(event) {
  //   if (!event || event.code === 'Space') {
  //     actions.jump();
  //   }
  // }
  // usePlayerControl(handleJump);

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

  // Subscribe the NN to updates
  useFlappyNeuralNetwork();

  // NO REFS?!?! Thanks Zustand!
  return (
    <>
      <GameVisor
        round={round}
        score={score}
        runState={runState}
      />
      {initialized ? (
        <>
          {birds.map((bird, index) => (
            <Bird
              key={index}
              position={bird.position}
              isAlive={bird.isAlive}
            />
          ))}
          {pipes.map((pipe, index) => (
            <Pipe
              key={index}
              position={pipe.position}
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
