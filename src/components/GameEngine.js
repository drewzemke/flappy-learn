import React, { useEffect } from 'react';
import { Bird } from './game-elements/Bird';
import { Pipe } from './game-elements/Pipe';
import { useStore } from '../state/stateManagement';
import { GameVisor } from './GameVisor';
import { RunState } from '../game-model/RunState';
import { useControls } from '../hooks/controlHooks';

export default function GameEngine({ isPlayerHuman }) {
  const {
    actions,
    score,
    lastRoundScore,
    round,
    runState,
    birds,
    pipes,
    initialized,
    gameSettings,
  } = useStore(); // update to include a selector???

  // Automatically resets the game after a second -- REMOVE EVENTUALLY!
  if (runState === RunState.DEAD) {
    actions.prepareToRestart();
    setTimeout(actions.start, 1000);
  }

  // Initialize the model
  useEffect(() => {
    actions.init(isPlayerHuman);
    return actions.unInit;
    // eslint-disable-next-line
  }, []);

  // This function deals with these key presses:
  // - Enter: start the game or simulation
  // - Esc: pause menu
  // - Spacebar: jump (if player controls)
  function handleKeyDown(event) {
    if (event.code === 'Enter' && runState === RunState.WAITING_TO_START) {
      actions.start();
    }
    if (event.code === 'Escape') {
      // Do something here eventually
    }
    if (isPlayerHuman && event.code === 'Space') {
      actions.jump(0);
    }
  }
  useControls(isPlayerHuman, handleKeyDown);

  // NO REFS?!?! Thanks Zustand!
  return (
    <>
      <GameVisor
        round={round}
        score={score}
        lastRoundScore={lastRoundScore}
        runState={runState}
        numAlive={birds.filter(bird => bird.isAlive).length}
      />
      {initialized ? (
        <>
          {birds.map((bird, index) => (
            <Bird
              key={index}
              position={bird.position}
              vertVelocity={bird.vertVelocity}
              isAlive={bird.isAlive}
              gameSettings={gameSettings}
            />
          ))}
          {pipes.map((pipe, index) => (
            <Pipe
              key={index}
              position={pipe.position}
              gameSettings={gameSettings}
            />
          ))}
        </>
      ) : null}
      <BackgroundPanel />
    </>
  );
}

function BackgroundPanel() {
  const gameSettings = useStore(state => state.gameSettings);

  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry
        args={[gameSettings.screenWidth, gameSettings.screenHeight, 1, 1]}
      />
      <meshBasicMaterial
        // wireframe
        color={'skyblue'}
      />
    </mesh>
  );
}
