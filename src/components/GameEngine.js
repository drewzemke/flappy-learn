import React, { useEffect, useRef } from 'react';
import Bird from './game-elements/Bird';
import Pipe from './game-elements/Pipe';
import { useStore } from '../state/stateManagement';
import { GameState } from '../state/gameStore';
import useControls from '../hooks/useControls';

export default function GameEngine({ isPlayerHuman }) {
  const {
    actions,
    score,
    lastRoundScore,
    round,
    birds,
    pipes,
    initialized,
    gameSettings,
    gameState,
  } = useStore(); // update to include a selector???

  // Initialize the model
  useEffect(() => {
    actions.init(isPlayerHuman);
    return actions.unInit;
    // eslint-disable-next-line
  }, []);

  // I guess I need to use a ref for this, since the handleKeyDown
  // callback won't refer to the current state when it's run... dunno why
  const gameStateRef = useRef();
  gameStateRef.current = gameState;

  // This function deals with these key presses:
  // - Enter: start the game or simulation
  // - Esc: pause menu
  // - Spacebar: jump (if player controls)
  const handleKeyDown = event => {
    event.preventDefault();
    if (event.code === 'Enter') {
      if (
        [GameState.PLAYER_INTRO_SCREEN, GameState.AI_SETTINGS].includes(
          gameStateRef.current
        )
      ) {
        actions.prepNextRound();
        actions.start();
      }
      if (
        [GameState.PLAYER_DEAD, GameState.AI_DEAD].includes(
          gameStateRef.current
        )
      ) {
        actions.start();
      }
    }
    if (event.code === 'Escape') {
      // Do something here eventually
    }
    if (isPlayerHuman && event.code === 'Space') {
      actions.jump(0);
    }
  };
  useControls(isPlayerHuman, handleKeyDown);

  // NO REFS?!?! Thanks Zustand!
  return (
    <>
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
    </>
  );
}
