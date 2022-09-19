export default class BirdModel {
  constructor(x, y, velY, jumpVel) {
    this._x = x;
    this._y = y;
    this._velY = velY;
    this._jumpVel = jumpVel;
    this._isAlive = true;
    this._isOffScreen = false;
  }
  triggerJump() {
    if (this._isAlive) this._velY = this._jumpVel;
  }
  tick(delta, gameSettings) {
    if (this._isAlive) {
      this._velY -= gameSettings.gravity * delta;
      this._y += this._velY * delta;
    } else {
      // If the bird is dead, move it to the left (at the same speed as the pipes)
      // until it's offscreen
      // The extra +0.1 there is arbitrary -- just to give a bit of extra
      // cooldown after the last bird is swept offscreen
      if (this._x >= -(0.5 + 0.1) * gameSettings.gameWidth) {
        this._x -= gameSettings.pipeSpeed * delta;
      }
      // If we've already scrolled far enough, report that this
      // bird is offscreen
      else this._isOffScreen = true;
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
  get isOffScreen() {
    return this._isOffScreen;
  }
}
