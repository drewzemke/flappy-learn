import { useEffect } from 'react';
import { initFlappyNeuralNetwork } from '../game-logic/ai/FlappyNN';
import { GameState } from '../game-logic/state/gameStore';

// Conditionally sets up a controls scheme using either player input (spacebar) or
// a neural network
export default function useControls(
  actions,
  isPlayerHuman,
  gameStateRef,
  containerRef
) {
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

  useEffect(() => {
    // Set up a key listener for spacebar (for the human player)
    // and escape (in both cases)
    window.addEventListener('keydown', handleInput);

    // Add another listener to pause the game if the window loses focus
    window.addEventListener('blur', actions.pauseGame);

    // Make a copy of the ref's object, since it might get clobbered
    // by the time the cleanup function runs
    const containerDiv = containerRef.current;
    containerDiv.addEventListener('pointerdown', handleInput);

    // Set up the neural network stuff if needed.
    let unsubCallback;
    if (!isPlayerHuman) {
      unsubCallback = initFlappyNeuralNetwork();
    }

    // Get rid of the listeners and (if AI) unsubscribe
    // from the game state on unmount
    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('blur', actions.pauseGame);
      containerDiv.removeEventListener('pointerdown', handleInput);
      if (unsubCallback) unsubCallback();
    };
    // eslint-disable-next-line
  }, []);
}
