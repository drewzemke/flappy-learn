// Returns a nonempty message if a collision was detect, null if not.
export function testRoomCollisions(birdPos, gameSettings) {
  // First, check if we've hit the top or bottom
  if (
    Math.abs(birdPos.y) + gameSettings.birdRadius >
    gameSettings.screenHeight / 2 + gameSettings.collisionTolerance
  ) {
    return 'died by hitting the top or bottom of the screen';
  }
  return null;
}

export function testPipeCollisions(birdPos, pipePos, gameSettings) {
  // If we're above or below the gap, we just need to be at least a bird's radius
  // away from the side of the pipe
  if (Math.abs(birdPos.y - pipePos.y) > gameSettings.pipeGapSize / 2) {
    if (
      Math.abs(birdPos.x - pipePos.x) - gameSettings.birdRadius <
      gameSettings.pipeWidth / 2 - gameSettings.collisionTolerance
    ) {
      return 'died by hitting the side of a pipe';
    }
  }

  // So we're between the gaps vertically. If the bird center is directly above or below
  // the pipes, we just need to be a radius way pipes top/bottom
  if (Math.abs(birdPos.x - pipePos.x) < gameSettings.pipeWidth / 2) {
    if (
      Math.abs(birdPos.y - pipePos.y) + gameSettings.birdRadius >
      gameSettings.pipeGapSize / 2 + gameSettings.collisionTolerance
    ) {
      return 'died by hittng the top or bottom of a pipe';
    }
  }

  // Last thing: check for collision with the pipe corner
  // Start by finding the coordinates of the closest pipe corner
  const cornerX =
    birdPos.x < pipePos.x
      ? pipePos.x - gameSettings.pipeWidth / 2
      : pipePos.x + gameSettings.pipeWidth / 2;
  const cornerY =
    birdPos.y < pipePos.y
      ? pipePos.y - gameSettings.pipeGapSize / 2
      : pipePos.y + gameSettings.pipeGapSize / 2;
  // Compute the distance to the corner and return true if that's closer than the bird radius
  const dist = Math.sqrt(
    (cornerX - birdPos.x) ** 2 + (cornerY - birdPos.y) ** 2
  );

  if (dist < gameSettings.birdRadius - gameSettings.collisionTolerance) {
    return 'died by hitting a corner';
  }

  return null;
}
