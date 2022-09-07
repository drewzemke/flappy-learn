import { GameConstants } from './GameConstants';

// Running States
export const RunState = {
  WAITING_TO_START: 0,
  RUNNING: 1,
  DEAD: 2,
  RESTARTING: 3,
};

export class BirdModel {
  constructor(
    y = GameConstants.BIRD_INITIAL_Y,
    velY = GameConstants.BIRD_INITIAL_VEL
  ) {
    this._x = GameConstants.BIRD_X;
    this._y = y;
    this._velY = velY;
    this._isAlive = true;
  }
  triggerJump() {
    this._velY = GameConstants.BIRD_JUMP_VEL;
  }
  tick(delta) {
    if (this._isAlive) {
      this._velY -= GameConstants.GRAVITY * delta;
      this._y += this._velY * delta;
    } else {
      if (this._x >= -GameConstants.SCREEN_WIDTH) {
        this._x -= GameConstants.PIPE_SPEED * delta;
      }
    }
  }
  get position() {
    return { x: this._x, y: this._y };
  }
  get vertVelocity() {
    return this._velY;
  }
  kill() {
    this._isAlive = false;
  }
  get isAlive() {
    return this._isAlive;
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

// Returns a nonempty message if a collision was detect, null if not.
export function testRoomCollisions(birdPos) {
  // First, check if we've hit the top or bottom
  if (
    Math.abs(birdPos.y) + GameConstants.BIRD_RADIUS >
    GameConstants.SCREEN_HEIGHT / 2 + GameConstants.COLLISION_TOLERANCE
  ) {
    return 'died by hitting the top or bottom of the screen';
  }
  return null;
}

export function testPipeCollisions(birdPos, pipePos) {
  // If we're above or below the gap, we just need to be at least a bird's radius
  // away from the side of the pipe
  if (Math.abs(birdPos.y - pipePos.y) > GameConstants.PIPE_GAP_SIZE / 2) {
    if (
      Math.abs(birdPos.x - pipePos.x) - GameConstants.BIRD_RADIUS <
      GameConstants.PIPE_WIDTH / 2 - GameConstants.COLLISION_TOLERANCE
    ) {
      return 'died by hitting the side of a pipe';
    }
  }

  // So we're between the gaps vertically. If the bird center is directly above or below
  // the pipes, we just need to be a radius way pipes top/bottom
  if (Math.abs(birdPos.x - pipePos.x) < GameConstants.PIPE_WIDTH / 2) {
    if (
      Math.abs(birdPos.y - pipePos.y) + GameConstants.BIRD_RADIUS >
      GameConstants.PIPE_GAP_SIZE / 2 + GameConstants.COLLISION_TOLERANCE
    ) {
      return 'died by hittng the top or bottom of a pipe';
    }
  }

  // Last thing: check for collision with the pipe corner
  // Start by finding the coordinates of the closest pipe corner
  const cornerX =
    birdPos.x < pipePos.x
      ? pipePos.x - GameConstants.PIPE_WIDTH / 2
      : pipePos.x + GameConstants.PIPE_WIDTH / 2;
  const cornerY =
    birdPos.y < pipePos.y
      ? pipePos.y - GameConstants.PIPE_GAP_SIZE / 2
      : pipePos.y + GameConstants.PIPE_GAP_SIZE / 2;
  // Compute the distance to the corner and return true if that's closer than the bird radius
  const dist = Math.sqrt(
    (cornerX - birdPos.x) ** 2 + (cornerY - birdPos.y) ** 2
  );

  if (dist < GameConstants.BIRD_RADIUS - GameConstants.COLLISION_TOLERANCE) {
    return 'died by hitting a corner';
  }

  return null;
}
