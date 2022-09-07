import { addEffect } from '@react-three/fiber';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameConstants } from './GameConstants';
import { SimulationConstants } from '../ai/SimulationConstants';
import {
  RunState,
  BirdModel,
  PipeModel,
  testRoomCollisions,
  testPipeCollisions,
} from './FlappyGameModel';
import { GeneticNeuralNetwork } from '../ai/GeneticNeuralNet';

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
      addEffectUnsub: null,
      lastRoundScore: 0,

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
            // Initialize the neural nets
            const neuralNets = Array.from(
              { length: SimulationConstants.NUM_BIRDS },
              () => {
                const neuralNet = new GeneticNeuralNetwork(
                  SimulationConstants.NN_SIGNATURE
                );
                neuralNet.initRandom(
                  SimulationConstants.NN_INIT_MEAN,
                  SimulationConstants.NN_INIT_STDDEV
                );
                return neuralNet;
              }
            );

            set({ initialized: true, neuralNets: neuralNets }); // We're doing it!
          }

          // Make some birds
          // Array.from to the rescue!
          const birds = Array.from(
            { length: SimulationConstants.NUM_BIRDS },
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

          // Use addEffect to do frame-by-frame computations
          // (First, clear the old addEffect subscription if there is one)
          if (get().addEffectUnsub) {
            get().addEffectUnsub();
          }
          const unsub = addEffect(() => {
            // Don't do shit unless the game is running
            const { runState, lastRenderTime } = get();
            if (runState !== RunState.RUNNING) return;

            // Update the score if we're scoring with frames
            if ((GameConstants.SCORE_METHOD = 'frames')) {
              set(state => ({
                score: state.score + 1,
              }));
            }

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
              set({
                activePipeIndex: (activePipeIndex + 1) % pipes.length,
              });
              if ((GameConstants.SCORE_METHOD = 'pipes')) {
                set(state => ({
                  score: state.score + 1,
                }));
              }
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

          set({ addEffectUnsub: unsub });
        },

        jump: index => {
          get().birds[index].triggerJump();
        },

        prepareToRestart: () => {
          console.log('Restarting game!');
          set(state => ({
            lastRoundScore: state.score,
          }));
          get().actions.init();
          set(state => ({
            runState: RunState.RESTARTING,
            round: state.round + 1,
            neuralNets: GeneticNeuralNetwork.makeNewGeneration(
              state.neuralNets
            ),
          }));
        },

        start: () => {
          if (get().runState === RunState.WAITING_TO_START) {
            console.log('Starting game!');
            set({ round: 1 });
            set({ lastRenderTime: Date.now(), runState: RunState.RUNNING });
          }

          if (get().runState === RunState.RESTARTING) {
            set({ lastRenderTime: Date.now(), runState: RunState.RUNNING });
          }
        },

        triggerDeath: (birdIndex, message) => {
          const { birds, score, neuralNets } = get();
          birds[birdIndex].kill();

          // console.log(`Bird #${birdIndex} ${message}`);

          // Update the fitness of the corresponding NN.
          neuralNets[birdIndex].fitness = score;

          // Check if all of the birds are dead.
          if (birds.every(bird => !bird.isAlive)) {
            set({ runState: RunState.DEAD });
          }
        },
      },
    };
  })
);
