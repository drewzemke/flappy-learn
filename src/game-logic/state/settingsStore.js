export const settingsSlice = (set, get) => ({
  gameSettings: {
    // These are the width and height of the game screen IN THREEJS UNITS
    gameWidth: 8,
    gameHeight: 4.5,
    // Bird physics
    gravity: 15,
    birdRadius: 0.25,
    birdX: -3,
    birdInitialY: -0.5,
    birdJumpVel: 5,
    // Pipe physics
    pipeWidth: 0.75,
    pipeGapSize: 1.5,
    pipeSpeed: 1.5,
    pipeSpacing: 2.5,
    pipeInitialX: 1,
    pipeMaxAbsY: 1,
    // Collisions
    collisionTolerance: 0.03,
    // Scoring method options:
    // - 'frames' counts each frame of the simulation as a point
    // - 'pipes' counts each pipe passed as a point
    scoreMethod: 'pipes',
  },

  setGameSettings: newGameSettings => {
    set({
      gameSettings: newGameSettings,
    });
  },

  simulationSettings: {
    // Number of birds in each generation (should be even)
    numBirds: 80,

    // Signature for each neural network
    // This has to start with 5 and end with 1, but can have entries in between
    neuralNetSignature: [5, 3, 1],

    // Constants for NN creation and reproduction:
    neuralNetInitialMean: 0,
    neuralNetStandardDev: 4,
    reproductionMutationRate: 0.2,
    reproductionMutationStdDev: 2,
    // The method by which we choose members of one generation to make the next one
    // - 'pairs' -- pair off the top 50% and have each pair produce 4 children
    // - 'weighted' -- randomly select pairs to made with weights based on fitness
    reproductionMethod: 'pairs',
    childrenPerPair: 4,
    // This is a number p between 0 and 1 that determines the cutoff for randomly selecting
    // neural nets to reproduce based on fitness. If p < 1, only the neural nets representing the
    // top 100p% of the total fitness in a generation will be chosen from.
    weightedMaxQuota: 0.1,

    // This automatically moves the simulation to the next round instead of making
    // the user press the 'next round' button
    autoAdvance: false,
  },

  setSimSettings: newSimSettings => {
    set({
      simulationSettings: newSimSettings,
    });
  },
});
