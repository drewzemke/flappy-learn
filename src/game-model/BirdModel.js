export default class BirdModel {
  constructor(x, y, velY, jumpVel) {
    this._x = x;
    this._y = y;
    this._velY = velY;
    this._jumpVel = jumpVel;
    this._isAlive = true;
  }
  triggerJump() {
    this._velY = this._jumpVel;
  }
  tick(delta, gameSettings) {
    if (this._isAlive) {
      this._velY -= gameSettings.gravity * delta;
      this._y += this._velY * delta;
    } else {
      // If the bird is dead, move it to the left (at the same speed as the pipes)
      // until it's offscreen
      if (this._x >= -gameSettings.gameWidth) {
        this._x -= gameSettings.pipeSpeed * delta;
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
