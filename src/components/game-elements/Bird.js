import React, { useMemo } from 'react';
import { TextureLoader, NearestFilter } from 'three';
import { useLoader } from '@react-three/fiber';

export default function Bird({
  position,
  vertVelocity = 0,
  isAlive = true,
  gameSettings,
}) {
  // Load the spritesheet for the bird.
  const birdTexture = useLoader(
    TextureLoader,
    '/textures/bird-spritesheet.png'
  );
  birdTexture.minFilter = NearestFilter;
  birdTexture.magFilter = NearestFilter;

  // There are two spites -- make a clone of this one that
  // we can use for the other offset
  // (Setting the offset each from doesn't work when there's more
  // than one bird, because they all share the same texture!)
  birdTexture.repeat.set(0.5, 1);
  const clone = useMemo(() => {
    const texture = birdTexture.clone();
    texture.needsUpdate = true;
    texture.offset.x = 0.5;
    return texture;
  }, [birdTexture]);

  // Compute the rotation -- just atan2 of the velocity??
  const birdRotation = Math.atan2(vertVelocity, gameSettings.pipeSpeed) / 4;

  return (
    <sprite
      position={[position.x, position.y, 0]}
      scale={gameSettings.birdRadius * 2}
    >
      <spriteMaterial
        map={vertVelocity > 0 ? birdTexture : clone}
        rotation={birdRotation}
        color={isAlive ? 'white' : 'grey'}
      />
    </sprite>
  );
}
