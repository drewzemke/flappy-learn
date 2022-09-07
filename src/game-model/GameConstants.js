export const GameConstants = {
  // Screen constants
  SCREEN_HEIGHT: 4.5,
  SCREEN_WIDTH: 8,
  // Bird physics
  GRAVITY: 10,
  BIRD_RADIUS: 0.25,
  BIRD_X: -3,
  BIRD_INITIAL_Y: 0,
  BIRD_INITIAL_VEL: 4,
  BIRD_JUMP_VEL: 2.5,
  // Pipe physics
  PIPE_WIDTH: 1,
  PIPE_GAP_SIZE: 1.75,
  PIPE_SPEED: 2,
  PIPE_SPACING: 2.2,
  PIPE_INITIAL_X: 0,
  PIPE_MAX_ABS_Y: 1.3,
  // Collisions
  COLLISION_TOLERANCE: 0.03,
  // Scoring method options:
  // - 'frames' counts each frame of the simulation as a point
  // - 'pipes' counts each pipe passed as a point
  SCORE_METHOD: 'frames',
};
