import React from 'react';
import { GameConstants } from '../../game-model/GameConstants';

export function Pipe({ position }) {
  return (
    <group position={[position.x, position.y, 0]}>
      <mesh
        position={[
          0,
          -GameConstants.SCREEN_HEIGHT / 2 - GameConstants.PIPE_GAP_SIZE / 2,
          0,
        ]}
      >
        <planeGeometry
          args={[GameConstants.PIPE_WIDTH, GameConstants.SCREEN_HEIGHT, 1, 1]}
        />
        <meshBasicMaterial color={'green'} />
      </mesh>
      <mesh
        position={[
          0,
          GameConstants.SCREEN_HEIGHT / 2 + GameConstants.PIPE_GAP_SIZE / 2,
          0,
        ]}
      >
        <planeGeometry
          args={[GameConstants.PIPE_WIDTH, GameConstants.SCREEN_HEIGHT, 1, 1]}
        />
        <meshBasicMaterial color={'green'} />
      </mesh>
    </group>
  );
}
