import React, { useEffect, useRef } from 'react';
import Bird from './game-elements/Bird';
import Pipe from './game-elements/Pipe';
import { useStore } from '../state/stateManagement';
import { GameState } from '../state/gameStore';
import useControls from '../hooks/useControls';

export default function GameEngine({ containerRef, isPlayerHuman }) {
  const { actions, birds, pipes, initialized, gameSettings, gameState } =
    useStore(); // TODO: update to include a selector???

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

  // Deals with various possible key presses or pointer clicks/taps
  const handleInput = event => {
    event.preventDefault();
    // Space or click
    // Start the game if the game is in a waiting state, but
    // also check if we need to prep the first round
    if (
      (event.type === 'keydown' && event.code === 'Space') ||
      event.type === 'pointerdown'
    ) {
      if (
        [
          GameState.PLAYER_INTRO_SCREEN,
          GameState.AI_SETTINGS,
          GameState.PLAYER_PAUSED,
          GameState.AI_PAUSED,
        ].includes(gameStateRef.current)
      ) {
        actions.start();
        return;
      }
      if (
        [GameState.PLAYER_DEAD, GameState.AI_DEAD].includes(
          gameStateRef.current
        )
      ) {
        actions.prepNextRound();
        actions.start();
        return;
      }
    }
    // Escape
    // Open/close the pause menu
    if (event.type === 'keydown' && event.code === 'Escape') {
      // Pause the game
      actions.pauseGame();
      return;
    }
    // Space or click
    // If there's a human playing, make the bird jump
    if (
      isPlayerHuman &&
      ((event.type === 'keydown' && event.code === 'Space') ||
        event.type === 'pointerdown')
    ) {
      actions.jump(0);
      return;
    }
  };

  useControls(handleInput, isPlayerHuman, containerRef);

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
