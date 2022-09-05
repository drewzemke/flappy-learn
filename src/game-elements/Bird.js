import React from 'react';
import { GameConstants } from '../game-model/GameConstants';

export function Bird({ position }) {
  return (
    <mesh position={[position.x, position.y, 0]}>
      <sphereGeometry args={[GameConstants.BIRD_RADIUS, 10, 10]} />
      {/* <planeGeometry
        args={[
          GameConstants.PLAYER_RADIUS * 2,
          GameConstants.PLAYER_RADIUS * 2,
          1,
          1
        ]}
      /> */}
      <meshBasicMaterial color={'goldenrod'} />
    </mesh>
  );
}
