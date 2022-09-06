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
import { subscribeWithSelector } from 'zustand/middleware';

export const useStore = create(
  subscribeWithSelector((set, get) => {
    return {
      initialized: false,
      runState: RunState.WAITING_TO_START,
      score: 0,
      lastRenderTime: Date.now(),
      birds: [],
      pipes: [],
      activePipeIndex: 0,
      round: 0,
      neuralNets: [],

      // Hi Drew.
      //
      // You're doing great! Before you build a fun abstract linear-algebra-y
      // neural net class, you need to refactor the store (and probably the whole app)
      // to allow for multiple birds.
      //
      // Then it's time to build the neural nets to consume the information
      // and trigger the jump hook. Good luck!

      actions: {
        // sets or resets the game
        init: () => {
          if (!get().initialized) {
            set({ initialized: true }); // We're doing it!

            // Initialize the neural nets
            // ...
          }

          // Make some birds
          // Array.from to the rescue!
          const birds = Array.from(
            { length: GameConstants.NUM_BIRDS },
            () => new BirdModel()
          );

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
            // send in the birds
            birds: birds,
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

            // IMPORTANT (I think)
            // In order for subscribe dispatches to work correct,
            // we can only have on 'set' call per frame.
            // So if you're gonna do other 'set's in this frame, bundle them
            // with this.
            set({ lastRenderTime: now });

            // Advance the (alive) birds and pipes
            const { birds, pipes, activePipeIndex } = get();
            birds.forEach(bird => {
              bird.tick(delta);
            });
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

            // 3: Check for collisions between each bird and the active pipe
            birds.forEach((bird, index) => {
              if (bird.isAlive) {
                let collision = testRoomCollisions(bird.position);
                if (!collision) {
                  collision = testPipeCollisions(
                    bird.position,
                    pipes[activePipeIndex].position
                  );
                }

                if (collision) get().actions.triggerDeath(index, collision);
              }
            });
          });
        },

        jump: index => {
          get().birds[index].triggerJump();
        },

        start: () => {
          const { runState, actions } = get();
          if (runState === RunState.WAITING_TO_START) {
            console.log('Starting game!');
            set({ round: 1 });
          }

          if (runState === RunState.DEAD) {
            console.log('Restarting game!');
            actions.init();
            set(state => ({ round: state.round + 1 }));
            // Do something here to make a new generation of neural nets!
            // ...
          }
          set({ lastRenderTime: Date.now(), runState: RunState.RUNNING });
        },

        triggerDeath: (birdIndex, message) => {
          const { birds } = get();
          birds[birdIndex].kill();

          console.log(`Bird #${birdIndex} ${message}`);

          // Check if all of the birds are dead.
          if (birds.every(bird => !bird.isAlive)) {
            set({ runState: RunState.DEAD });
          }
        },
      },
    };
  })
);
