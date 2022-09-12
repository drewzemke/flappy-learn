import { useEffect } from 'react';
import { initFlappyNeuralNetwork } from '../ai/FlappyNN';

// Conditionally sets up a controls scheme using either player input (spacebar) or
// a neural network
export function useControls(isPlayerHuman, handleKeyDown) {
  useEffect(() => {
    // Set up a key listener for spacebar (for the human player)
    // and escape (in both cases)
    window.addEventListener('keydown', handleKeyDown);

    // Set up the neural network stuff if needed.
    let unsubCallback;
    if (!isPlayerHuman) {
      unsubCallback = initFlappyNeuralNetwork();
    }

    // Get rid of the key listener and (if AI) unsubscribe
    // from the game state on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (unsubCallback) unsubCallback();
    };
    // eslint-disable-next-line
  }, []);
}
