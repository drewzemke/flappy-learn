import { GameConstants } from './GameConstants';

// Running States
export const RunState = {
  WAITING_TO_START: 0,
  RUNNING: 1,
  DEAD: 3,
};

export class obsolete_FlappyBirdGameModel {
  // NEXT UP: game state! wait for a pause before starting, the reset on death,
  // keep score, etc

  constructor() {
    // Make everthing
    this._init();
    // Initially waiting to start
    this._runState = RunState.WAITING_TO_START;
  }

  _init() {
    this._initBird();
    this._initPipes();
    this._score = 0;
  }

  _initBird() {
    // Make a bird
    this._bird = new BirdModel(
      GameConstants.BIRD_INITIAL_Y,
      GameConstants.BIRD_INITIAL_VEL
    );
  }

  _initPipes() {
    // First, how many pipes do we need?
    this._numPipes =
      Math.ceil(GameConstants.SCREEN_WIDTH / GameConstants.PIPE_SPACING) + 1;
    // Make that many pipes
    this._pipes = [];
    for (let i = 0; i < this._numPipes; i++) {
      const pipeX =
        GameConstants.PIPE_INITIAL_X + i * GameConstants.PIPE_SPACING;
      this._pipes.push(new PipeModel(pipeX));
    }
    // Set the first 'active pipe' to be the first one
    this._activePipeIndex = 0;
  }

  get state() {
    return {
      birdPosition: this._bird.position,
      pipesPositions: this._pipes.map(pipe => pipe.position),
      activePipe: this._activePipeIndex,
      runState: this._runState,
      score: this._score,
    };
  }

  triggerJump() {
    this._bird.triggerJump();
  }

  start() {
    if (this._runState === RunState.WAITING_TO_START) {
      console.log('Starting game!');
      this._runState = RunState.RUNNING;
    }

    if (this._runState === RunState.DEAD) {
      console.log('Restarting game!');
      this._init();
      this._runState = RunState.RUNNING;
    }
  }

  tick(delta) {
    // Don't do anything unless the game is running
    if (this._runState !== RunState.RUNNING) return;

    // Check for collisions
    if (this._findCollisions()) {
      this._triggerDeath();
      return;
    }

    // Move everything
    this._bird.tick(delta);
    this._pipes.forEach(pipe => pipe.tick(delta));

    // PIPE STUFF ---
    // 1) Check if the pipe to the left of the active pipe has scrolled offscreen,
    //    and reset it to the right if so
    const previousPipeIndex =
      this._activePipeIndex > 0
        ? this._activePipeIndex - 1
        : this._numPipes - 1;
    if (
      this._pipes[previousPipeIndex]._x <
      -GameConstants.SCREEN_WIDTH / 2 - GameConstants.PIPE_WIDTH / 2
    ) {
      this._pipes[previousPipeIndex].resetPosition(
        this._numPipes * GameConstants.PIPE_SPACING
      );
    }
    // 2) Check if the active pipe has scrolled past where it could collide with the
    //    bird, and advance the active pipe index if so.
    //    Also increase the score, since we passed a pipe :)
    if (
      this._pipes[this._activePipeIndex]._x <
      GameConstants.BIRD_X - GameConstants.BIRD_RADIUS
    ) {
      this._activePipeIndex = (this._activePipeIndex + 1) % this._numPipes;
      this._score++;
    }
  }

  _findCollisions() {
    // This should probably take a bird as an argument eventually
    const bird = this._bird;

    // First, check if we've hit the top or bottom
    if (
      Math.abs(bird._posY) + GameConstants.BIRD_RADIUS >
      GameConstants.SCREEN_HEIGHT / 2 + GameConstants.COLLISION_TOLERANCE
    ) {
      console.log('Died by hitting the top or bottom of the screen');
      return true;
    }

    // Now we need to check for intersection with the active pipe.
    const pipe = this._pipes[this._activePipeIndex];

    // If we're above or below the gap, we just need to be at least a bird's radius
    // away from the side of the pipe
    if (
      Math.abs(bird.position.y - pipe.position.y) >
      GameConstants.PIPE_GAP_SIZE / 2
    ) {
      if (
        Math.abs(bird.position.x - pipe.position.x) -
          GameConstants.BIRD_RADIUS <
        GameConstants.PIPE_WIDTH / 2 - GameConstants.COLLISION_TOLERANCE
      ) {
        console.log('Died by hitting the side of a pipe');
        return true;
      }
    }

    // So we're between the gaps vertically. If the bird center is directly above or below
    // the pipes, we just need to be a radius way pipes top/bottom
    if (
      Math.abs(bird.position.x - pipe.position.x) <
      GameConstants.PIPE_WIDTH / 2
    ) {
      if (
        Math.abs(bird.position.y - pipe.position.y) +
          GameConstants.BIRD_RADIUS >
        GameConstants.PIPE_GAP_SIZE / 2 + GameConstants.COLLISION_TOLERANCE
      ) {
        console.log('Died by hittng the top or bottom of a pipe');
        return true;
      }
    }

    // Last thing: check for collision with the pipe corner
    // Start by finding the coordinates of the closest pipe corner
    const cornerX =
      bird.position.x < pipe.position.x
        ? pipe.position.x - GameConstants.PIPE_WIDTH / 2
        : pipe.position.x + GameConstants.PIPE_WIDTH / 2;
    const cornerY =
      bird.position.y < pipe.position.y
        ? pipe.position.y - GameConstants.PIPE_GAP_SIZE / 2
        : pipe.position.y + GameConstants.PIPE_GAP_SIZE / 2;
    // Compute the distance to the corner and return true if that's closer than the bird radius
    const dist = Math.sqrt(
      (cornerX - bird.position.x) ** 2 + (cornerY - bird.position.y) ** 2
    );

    if (dist < GameConstants.BIRD_RADIUS - GameConstants.COLLISION_TOLERANCE) {
      console.log('Died by hitting a corner');
      return true;
    }

    return false;
  }

  // This should eventually take a bird (or its index) as an arg
  _triggerDeath() {
    this._runState = RunState.DEAD;
  }
}

export class BirdModel {
  constructor(
    posY = GameConstants.BIRD_INITIAL_Y,
    velY = GameConstants.BIRD_INITIAL_VEL
  ) {
    this._posY = posY;
    this._velY = velY;
  }
  triggerJump() {
    this._velY = GameConstants.BIRD_JUMP_VEL;
  }
  tick(delta) {
    this._velY -= GameConstants.GRAVITY * delta;
    this._posY += this._velY * delta;
  }
  get position() {
    return { x: GameConstants.BIRD_X, y: this._posY };
  }
}

export class PipeModel {
  constructor(x) {
    this._x = x;
    this.chooseRandomY();
  }

  chooseRandomY() {
    this._y = (2 * Math.random() - 1) * GameConstants.PIPE_MAX_ABS_Y;
  }

  get position() {
    return { x: this._x, y: this._y };
  }

  tick(delta) {
    this._x -= GameConstants.PIPE_SPEED * delta;
  }

  resetPosition(distance) {
    this._x += distance;
    this.chooseRandomY();
  }
}
