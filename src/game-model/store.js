import { GameConstants } from './GameConstants';
import create from 'zustand';
import {
  RunState,
  BirdModel,
  PipeModel,
  testRoomCollisions,
  testPipeCollisions,
} from './FlappyGameModel';
import { addEffect } from '@react-three/fiber';

export const useStore = create((set, get) => {
  return {
    initialized: false,
    runState: RunState.WAITING_TO_START,
    score: 0,
    lastRenderTime: Date.now(),
    bird: null,
    pipes: [],
    activePipeIndex: 0,

    actions: {
      // sets or resets the game
      init: () => {
        set({ initialized: true }); // We're doing it!

        // First, how many pipes do we need?
        const numPipes =
          Math.ceil(GameConstants.SCREEN_WIDTH / GameConstants.PIPE_SPACING) +
          1;
        // Make that many pipes
        const pipes = [];
        for (let i = 0; i < numPipes; i++) {
          const pipeX =
            GameConstants.PIPE_INITIAL_X + i * GameConstants.PIPE_SPACING;
          pipes.push(new PipeModel(pipeX));
        }

        // call the zustand set method
        set({
          // reset the score
          score: 0,
          // new bird
          bird: new BirdModel(
            GameConstants.BIRD_INITIAL_Y,
            GameConstants.BIRD_INITIAL_VEL
          ),
          // pass in the array of pipes we just made
          pipes: pipes,
          // set the first 'active pipe' to be the first one
          activePipeIndex: 0,
        });

        // Do the following each frame...
        addEffect(() => {
          // Don't do shit unless the game is running
          const { runState, lastRenderTime } = get();
          if (runState !== RunState.RUNNING) return;

          // Compute the time since the last render
          const now = Date.now();
          const delta = (now - lastRenderTime) / 1000;
          set({ lastRenderTime: now });

          // Advance the bird and pipes
          const { bird, pipes, activePipeIndex } = get();
          bird.tick(delta);
          pipes.forEach(pipe => pipe.tick(delta));

          // PIPE STUFF ---
          // 1) Check if the pipe to the left of the active pipe has scrolled offscreen,
          //    and reset it to the right if so
          const previousPipeIndex =
            activePipeIndex > 0 ? activePipeIndex - 1 : pipes.length - 1;
          if (
            pipes[previousPipeIndex].position.x <
            -GameConstants.SCREEN_WIDTH / 2 - GameConstants.PIPE_WIDTH / 2
          ) {
            pipes[previousPipeIndex].resetPosition(
              pipes.length * GameConstants.PIPE_SPACING
            );
          }
          // 2) Check if the active pipe has scrolled past where it could collide with the
          //    bird, and advance the active pipe index if so.
          //    Also increase the score, since we passed a pipe :)
          if (
            pipes[activePipeIndex].position.x <
            GameConstants.BIRD_X - GameConstants.BIRD_RADIUS
          ) {
            set(state => ({
              activePipeIndex: (activePipeIndex + 1) % pipes.length,
              score: state.score + 1,
            }));
          }

          // 3: Check for collisions with the active pipe
          const collision =
            testRoomCollisions(bird.position) ||
            testPipeCollisions(bird.position, pipes[activePipeIndex].position);

          if (collision) get().actions.triggerDeath();
        });
      },

      jump: () => {
        get().bird.triggerJump();
      },

      start: () => {
        const { runState, actions } = get();
        if (runState === RunState.WAITING_TO_START) {
          console.log('Starting game!');
        }

        if (runState === RunState.DEAD) {
          console.log('Restarting game!');
          actions.init();
        }
        set({ lastRenderTime: Date.now(), runState: RunState.RUNNING });
      },

      // This should take a bird as an arg eventually
      triggerDeath: () => {
        set({ runState: RunState.DEAD });
      },
    },
  };
});
