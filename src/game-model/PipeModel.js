export default class PipeModel {
  constructor(x, maxAbsY) {
    this._x = x;
    // Storing this so that we can use it when resetting this pipe's position
    this._maxAbsY = maxAbsY;
    this.chooseRandomY();
  }

  chooseRandomY() {
    this._y = (2 * Math.random() - 1) * this._maxAbsY;
  }

  get position() {
    return { x: this._x, y: this._y };
  }

  set position({ x, y }) {
    this._x = x;
    this._y = y;
  }

  tick(delta, gameSettings) {
    this._x -= gameSettings.pipeSpeed * delta;
  }

  resetPosition(distance) {
    this._x += distance;
    this.chooseRandomY();
  }
}
