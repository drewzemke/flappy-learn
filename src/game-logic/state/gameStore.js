import { addEffect } from '@react-three/fiber';
import GeneticNeuralNetwork from '../ai/GeneticNeuralNet';
import BirdModel from '../BirdModel';
import PipeModel from '../PipeModel';
import { testRoomCollisions, testPipeCollisions } from '../collisionTesting';

export const GameState = {
  NO_GAME: -1,
  PLAYER_INTRO_SCREEN: 0.0,
  PLAYER_PLAYING: 0.1,
  PLAYER_PAUSED: 0.2,
  PLAYER_DEAD: 0.3,
  AI_SETTINGS: 1.0,
  AI_PLAYING: 1.1,
  AI_PAUSED: 1.2,
  AI_DEAD: 1.3,
};

export const gameSlice = (set, get) => ({
  initialized: false,
  gameState: GameState.NO_GAME,
  round: 0,
  score: 0,
  scoreHistory: [],
  lastRenderTime: Date.now(),
  birds: [],
  pipes: [],
  activePipeIndex: 0,
  neuralNets: [],
  addEffectUnsub: null,

  actions: {
    // This is called once to set everything up the first time
    init: isPlayerHuman => {
      if (!get().initialized) {
        // Initialize the neural nets if needed
        if (!isPlayerHuman) {
          get().actions.initNeuralNets();
        } else {
          set({ neuralNets: [] });
        }

        set({
          initialized: true,
          round: 0,
          score: 0,
          scoreHistory: [],
          lastRenderTime: Date.now(),
          birds: [],
          pipes: [],
          activePipeIndex: 0,

          gameState: isPlayerHuman
            ? GameState.PLAYER_INTRO_SCREEN
            : GameState.AI_SETTINGS,
        });

        // Use addEffect to do frame-by-frame computations
        // (First, clear the old addEffect subscription if there is one)
        if (get().addEffectUnsub) {
          get().addEffectUnsub();
        }

        const unsub = addEffect(() => {
          get().actions.frameLoop();
        });

        set({ addEffectUnsub: unsub });

        // Prepare the first round
        get().actions.prepNextRound(true);
      }
    },

    // This is called whenever we need to (reinitialize) the neural nets
    initNeuralNets: () => {
      const { simulationSettings } = get();

      const neuralNets = Array.from(
        { length: simulationSettings.numBirds },
        () => {
          const neuralNet = new GeneticNeuralNetwork(
            simulationSettings.neuralNetSignature
          );
          neuralNet.initRandom(
            simulationSettings.neuralNetInitialMean,
            simulationSettings.neuralNetStandardDev
          );
          return neuralNet;
        }
      );

      set({ neuralNets: neuralNets });

      // Make a new set of birds
      get().actions.initBirds();
    },

    initBirds: () => {
      const { simulationSettings, gameSettings, neuralNets } = get();

      // Make some new birds
      // We can tell if this is a human player situation by checking
      // the neural network array
      const numBirds = neuralNets.length ? simulationSettings.numBirds : 1;
      const birds = Array.from(
        { length: numBirds },
        () =>
          new BirdModel(
            gameSettings.birdX,
            gameSettings.birdInitialY,
            // Setting the initial velocity to be equal to the jump vel for
            // human players, and 0 for ai
            neuralNets.length ? 0 : gameSettings.birdJumpVel,
            gameSettings.birdJumpVel
          )
      );
      // send in the birds
      set({ birds: birds });
    },

    // This is called before the start of every round.
    prepNextRound: (isFirstRound = false) => {
      const { gameSettings } = get();

      // Make some new birds
      get().actions.initBirds();

      // Make pipes. First, how many pipes do we need?
      const numPipes =
        Math.ceil(gameSettings.gameWidth / gameSettings.pipeSpacing) + 1;
      // Make that many pipes
      const pipes = [];
      for (let i = 0; i < numPipes; i++) {
        const pipeX = gameSettings.pipeInitialX + i * gameSettings.pipeSpacing;
        pipes.push(new PipeModel(pipeX, gameSettings.pipeMaxAbsY));
      }

      // Add that stuff to the state
      set(state => ({
        // reset the score
        score: 0,
        // pass in the array of pipes we just made
        pipes: pipes,
        // set the first 'active pipe' to be the first one
        activePipeIndex: 0,
        // advance the round counter:
        round: state.round + 1,
      }));

      // If this isn't the first round, we also need to make a new generation
      // of neural nets
      if (!isFirstRound) {
        set(state => ({
          neuralNets: GeneticNeuralNetwork.makeNewGeneration(
            state.neuralNets,
            state.simulationSettings
          ),
        }));
      }
    },

    // Starts the game (from intro screen, paused, or whatever)
    start: () => {
      const { gameState } = get();

      if (
        [
          GameState.PLAYER_INTRO_SCREEN,
          GameState.PLAYER_PAUSED,
          GameState.PLAYER_DEAD,
        ].includes(gameState)
      ) {
        set({ gameState: GameState.PLAYER_PLAYING });
      }

      if (
        [
          GameState.AI_SETTINGS,
          GameState.AI_PAUSED,
          GameState.AI_DEAD,
        ].includes(gameState)
      ) {
        set({ gameState: GameState.AI_PLAYING });
      }

      // Also update the last rendered time since we're about to start
      // rendering stuff again
      set({ lastRenderTime: Date.now() });
    },

    // Pauses the game mid-run
    pauseGame: () => {
      // console.log('Pausing game');
      if (get().gameState === GameState.PLAYER_PLAYING) {
        set({ gameState: GameState.PLAYER_PAUSED });
      }
      if (get().gameState === GameState.AI_PLAYING) {
        set({ gameState: GameState.AI_PAUSED });
      }
    },

    // Triggers a jump by the bird with the given index
    jump: index => {
      get().birds[index].triggerJump();
    },

    // Called when a collision is detected between a bird and an object
    triggerDeath: (birdIndex, message) => {
      const { birds, score, neuralNets } = get();
      birds[birdIndex].kill();

      // console.log(`Bird #${birdIndex} ${message}`);

      // Update the fitness of the corresponding NN.
      if (neuralNets[birdIndex]) neuralNets[birdIndex].fitness = score;

      // If this was the last bird to die, compute the average score and
      // add it to the score history
      if (birds.every(bird => !bird.isAlive)) {
        if (neuralNets.length) {
          // Add up the neural nets' score
          const total = neuralNets.reduce(
            (prev, curr) => prev + curr.fitness,
            0
          );
          const avg = total / neuralNets.length;
          set(state => ({
            scoreHistory: [...state.scoreHistory, avg],
          }));
        } else {
          // If there are no NNs, the player must be controlling,
          // so record the current score in the score history
          set(state => ({
            scoreHistory: [...state.scoreHistory, score],
          }));
        }
      }
    },

    // Called every frame
    frameLoop: () => {
      // Don't do shit unless the game is running
      if (
        ![GameState.PLAYER_PLAYING, GameState.AI_PLAYING].includes(
          get().gameState
        )
      )
        return;

      const { gameSettings, lastRenderTime } = get();

      // Update the score if we're scoring with frames
      if (gameSettings.scoreMethod === 'frames') {
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
        bird.tick(delta, gameSettings);
      });
      pipes.forEach(pipe => pipe.tick(delta, gameSettings));

      // PIPE STUFF ---
      // 1) Check if the pipe to the left of the active pipe has scrolled offscreen,
      //    and reset it to the right if so
      const previousPipeIndex =
        activePipeIndex > 0 ? activePipeIndex - 1 : pipes.length - 1;
      if (
        pipes[previousPipeIndex].position.x <
        -gameSettings.gameWidth / 2 - gameSettings.pipeWidth / 2
      ) {
        pipes[previousPipeIndex].resetPosition(
          pipes.length * gameSettings.pipeSpacing
        );
      }
      // 2) Check if the active pipe has scrolled past where it could collide with the
      //    bird, and advance the active pipe index if so.
      //    Also, if there are any birds alive, increase the score, since we passed a pipe :)
      if (
        pipes[activePipeIndex].position.x <
        gameSettings.birdX - gameSettings.birdRadius
      ) {
        set({
          activePipeIndex: (activePipeIndex + 1) % pipes.length,
        });
        if (
          gameSettings.scoreMethod === 'pipes' &&
          birds.some(bird => bird.isAlive)
        ) {
          set(state => ({
            score: state.score + 1,
          }));
        }
      }

      // 3: Check for collisions between each bird and the active pipe
      birds.forEach((bird, index) => {
        if (bird.isAlive) {
          let collision = testRoomCollisions(bird.position, gameSettings);
          if (!collision) {
            collision = testPipeCollisions(
              bird.position,
              pipes[activePipeIndex].position,
              gameSettings
            );
          }

          if (collision) get().actions.triggerDeath(index, collision);
        }
      });

      // Check if all of the birds are dead and have scrolled offscreen
      if (birds.every(bird => bird.isOffScreen)) {
        if (get().gameState === GameState.PLAYER_PLAYING) {
          set({ gameState: GameState.PLAYER_DEAD });
        }
        if (get().gameState === GameState.AI_PLAYING) {
          set({ gameState: GameState.AI_DEAD });
        }
      }
    },

    // Use this to reset shit between game sessions.
    // (Like, everything should reset when we go back to the menu)
    unInit: () => {
      set({ initialized: false, gameState: GameState.NO_GAME });
    },
  },
});
