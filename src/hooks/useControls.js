import { useEffect } from 'react';
import { initFlappyNeuralNetwork } from '../ai/FlappyNN';

// Conditionally sets up a controls scheme using either player input (spacebar) or
// a neural network
export default function useControls(handleInput, isPlayerHuman, containerRef) {
  useEffect(() => {
    // Set up a key listener for spacebar (for the human player)
    // and escape (in both cases)
    window.addEventListener('keydown', handleInput);

    // Make a copy of the ref's object, since it might get clobbered
    // by the time the cleanup function runs
    const containerDiv = containerRef.current;
    containerDiv.addEventListener('pointerdown', handleInput);

    // Set up the neural network stuff if needed.
    let unsubCallback;
    if (!isPlayerHuman) {
      unsubCallback = initFlappyNeuralNetwork();
    }

    // Get rid of the key listener and (if AI) unsubscribe
    // from the game state on unmount
    return () => {
      window.removeEventListener('keydown', handleInput);
      containerDiv.removeEventListener('pointerdown', handleInput);
      if (unsubCallback) unsubCallback();
    };
    // eslint-disable-next-line
  }, []);
}
