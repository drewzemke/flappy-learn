import { GameState } from '../state/gameStore';
import { useStore } from '../state/stateManagement';

export function initFlappyNeuralNetwork() {
  return useStore.subscribe(
    ({ birds, pipes, activePipeIndex, neuralNets, gameState, actions }) => {
      // No need to do anything if the game isn't running
      if (gameState === GameState.AI_PLAYING) {
        // Iterate over the birds
        birds.forEach((bird, index) => {
          // We don't do shit for dead birds.
          if (!bird.isAlive) {
            return;
          }

          // Otherwise, gather input for this bird and compute the
          // output using the NN.
          const input = getNNPackage(bird, pipes, activePipeIndex);
          const [output] = neuralNets[index].compute(input);
          // console.log(output);
          // If the output was bigger than 1/2, jump!
          if (output > 0.5) actions.jump(index);
        });
      }
    }
  );
}

// Takes bird and pipe data and extracts the following information to send
// to the NN (as an array!):
// - (bird's) y-position
// - y-velocity
// - x-position of the active pipe
// - the active pipe's center
// - the next pipe's center (It would be interesting to see what happens if we omit this!)
//
// In the future, maybe we also want to send:
// - the pipe gap (if that isn't constant)
// - the distance to the pipe the next one (same)
// But that would also involve updating the game to allow those two values to vary
function getNNPackage(bird, pipes, activePipeIndex) {
  const activePipe = pipes[activePipeIndex];
  const nextPipe = pipes[(activePipeIndex + 1) % pipes.length];
  return [
    bird.position.y,
    bird.vertVelocity,
    activePipe.position.x,
    activePipe.position.y,
    nextPipe.position.y,
  ];
}
