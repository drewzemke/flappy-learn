import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { NearestFilter, TextureLoader } from 'three';

export function Pipe({ position, gameSettings }) {
  const pipeTexture = useLoader(TextureLoader, '/textures/pipe-texture.png');
  pipeTexture.minFilter = NearestFilter;
  pipeTexture.magFilter = NearestFilter;

  // We need to scale the texture vertically so that it has the right aspect ratio
  // Don't ask me why this the right number -- it's something to do with
  // comparing the aspect ratios
  const repeatValue =
    pipeTexture.image.width /
    pipeTexture.image.height /
    (gameSettings.pipeWidth / gameSettings.screenHeight);
  pipeTexture.repeat.set(1, repeatValue);
  pipeTexture.offset.set(0, 1 - repeatValue);

  // Clone the pipe texture for the upside-down pipes
  // pipeTexture.repeat.set(0.5, 1);
  const upsideDownPipeTexture = useMemo(() => {
    const texture = pipeTexture.clone();
    texture.needsUpdate = true;
    texture.repeat.set(1, -repeatValue);
    texture.offset.set(0, 1);
    return texture;
    // eslint-disable-next-line
  }, [pipeTexture]);

  return (
    <group position={[position.x, position.y, 0]}>
      <sprite
        position={[
          0,
          -gameSettings.screenHeight / 2 - gameSettings.pipeGapSize / 2,
          0,
        ]}
        scale={[gameSettings.pipeWidth, gameSettings.screenHeight]}
      >
        <spriteMaterial map={pipeTexture} />
      </sprite>
      <sprite
        position={[
          0,
          gameSettings.screenHeight / 2 + gameSettings.pipeGapSize / 2,
          0,
        ]}
        scale={[gameSettings.pipeWidth, gameSettings.screenHeight]}
      >
        <spriteMaterial map={upsideDownPipeTexture} />
      </sprite>
      {/* <mesh
        position={[
          0,
          -gameSettings.screenHeight / 2 - gameSettings.pipeGapSize / 2,
          0,
        ]}
      >
        <planeGeometry
          args={[gameSettings.pipeWidth, gameSettings.screenHeight, 1, 1]}
        />
        <meshBasicMaterial color={'green'} />
      </mesh>
      <mesh
        position={[
          0,
          gameSettings.screenHeight / 2 + gameSettings.pipeGapSize / 2,
          0,
        ]}
      >
        <planeGeometry
          args={[gameSettings.pipeWidth, gameSettings.screenHeight, 1, 1]}
        />
        <meshBasicMaterial color={'green'} />
      </mesh> */}
    </group>
  );
}
