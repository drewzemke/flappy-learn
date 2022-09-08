export const SimulationConstants = {
  // Number of birds in each generation (should be even)
  NUM_BIRDS: 40,

  // Signature for each neural network
  // This has to start with 5 and end with 1, but can have entries in between
  NN_SIGNATURE: [5, 2, 1],

  // Constants for NN creation and reproduction:
  NN_INIT_MEAN: 0,
  NN_INIT_STDDEV: 4,
  NN_REP_MUTATION_RATE: 0.2,
  NN_REP_MUTATION_STDDEV: 2,
  // The method by which we choose members of one generation to make the next one
  // - 'pairs' -- pair off the top 50% and have each pair produce 4 children
  // - 'weighted' -- randomly select pairs to made with weights based on fitness
  REP_METHOD: 'pairs',
  // This is a number p between 0 and 1 that determines the cutoff for randomly selecting
  // neural nets to reproduce based on fitness. If p < 1, only the neural nets representing the
  // top 100p% of the total fitness in a generation will be chosen from.
  WEIGHTED_MAX_QUOTA: 0.1,
};
