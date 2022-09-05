import React from 'react';
import { GameConstants } from '../game-model/GameConstants';

function BirdInternal({ meshRef, position }) {
  return (
    // <mesh ref={meshRef}>
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

export const Bird = React.forwardRef((props, ref) => {
  return (
    <BirdInternal
      meshRef={ref}
      {...props}
    />
  );
});
