import { useStore } from '../game-model/store';
import { useEffect } from 'react';
import { GameConstants } from '../game-model/GameConstants';

export function useFlappyNeuralNetwork() {
  useEffect(() => {
    useStore.subscribe(
      state => ({
        birds: state.birds,
        pipes: state.pipes,
        activePipeIndex: state.activePipeIndex,
        triggerJump: state.actions.jump,
      }),
      ({ birds, pipes, activePipeIndex, triggerJump }) => {
        const input = getNNPackage(birds[0], pipes, activePipeIndex);
        if (input[0] < 0) {
          triggerJump(0);
        }
      }
    );
  }, []);
}

// Takes bird and pipe data and extracts the following information to send
// to the NN (as an array!):
// - (bird's) y-position
// - y-velocity
// - distance to the active pipe
// - offset relative to the active pipe's center
// - the offset of the next pipe (It would be interesting to see what happens if we omit this!)
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
    activePipe.position.x - GameConstants.BIRD_X,
    bird.position.y - activePipe.position.y,
    bird.position.y - nextPipe.position.y,
  ];
}
