import { useMemo } from 'react';
import { TextureLoader, NearestFilter } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { lerp, remap } from '../../utils/mathServices';
import { useRef } from 'react';

// Parameters for the clouds
const NUM_CLOUDS = 6;
const CLOUD_SCALE_RANGE = { min: 0.3, max: 0.9 };
const CLOUD_HEIGHT_RANGE = { min: 0.7, max: 2 };
const CLOUD_MAX_SPEED = 0.1;

export default function BackgroundPanel({
  gameWidth,
  gameHeight,
  animated = false,
}) {
  // Load the background texture.
  const backgroundTexture = useLoader(
    TextureLoader,
    'assets/textures/background.png'
  );
  backgroundTexture.minFilter = NearestFilter;
  backgroundTexture.magFilter = NearestFilter;

  // Load the cloud texture
  const cloudTexture = useLoader(
    TextureLoader,
    'assets/textures/clouds-spritesheet.png'
  );
  cloudTexture.minFilter = NearestFilter;
  cloudTexture.magFilter = NearestFilter;

  // There are three cloud spites -- make two clones for
  // the second and third textures
  cloudTexture.repeat.set(1 / 3, 1);
  const cloudTexture2 = useMemo(() => {
    const texture = cloudTexture.clone();
    texture.needsUpdate = true;
    texture.offset.x = 1 / 3;
    return texture;
  }, [cloudTexture]);
  const cloudTexture3 = useMemo(() => {
    const texture = cloudTexture.clone();
    texture.needsUpdate = true;
    texture.offset.x = 2 / 3;
    return texture;
  }, [cloudTexture]);

  // Need to wrap this in a useMemo that it doesn't get recreated each frame!
  const cloudTextures = useMemo(
    () => [cloudTexture, cloudTexture2, cloudTexture3],
    [cloudTexture, cloudTexture2, cloudTexture3]
  );

  // Randomly generate and animate some clouds;

  const clouds = useMemo(
    () =>
      Array.from({ length: NUM_CLOUDS }, (_, index) => {
        // Randomly pick a cloud texture
        const texture =
          cloudTextures[Math.floor(Math.random() * cloudTextures.length)];
        // To get an even-ish distribution, we'll make sure that each cloud
        // starts in its own horizontal strip of the screen
        const startingX =
          -gameWidth / 2 + (gameWidth / NUM_CLOUDS) * (index + Math.random());
        // Pick a scale
        const scale = lerp(
          CLOUD_SCALE_RANGE.min,
          CLOUD_SCALE_RANGE.max,
          Math.random()
        );
        // Use the scale to determine the height (so that smaller clouds are lower);
        const height = remap(
          scale,
          CLOUD_SCALE_RANGE.min,
          CLOUD_SCALE_RANGE.max,
          CLOUD_HEIGHT_RANGE.min,
          CLOUD_HEIGHT_RANGE.max
        );
        return {
          texture: texture,
          scale: scale,
          height: height,
          x: startingX,
        };
      }),
    [cloudTextures, gameWidth]
  );

  // Sort the clouds so that bigger clouds are in front
  clouds.sort((cloud1, cloud2) => cloud1.scale - cloud2.scale);

  // Animate the clouds -- the should move horizontally at a speed based on their scale
  const cloudsRef = useRef([]);
  useFrame((_, delta) => {
    if (animated) {
      cloudsRef.current.forEach((sprite, index) => {
        sprite.position.x -= CLOUD_MAX_SPEED * clouds[index].scale * delta;
        if (sprite.position.x < -0.6 * gameWidth) {
          sprite.position.x = 0.6 * gameWidth;
        }
      });
    }
  });

  return (
    <>
      <sprite
        position={[0, 0, 0]}
        scale={[gameWidth, gameHeight]}
      >
        <spriteMaterial
          map={backgroundTexture}
          transparent
          opacity={0.6}
        />
      </sprite>
      {clouds.map(({ texture, scale, height, x }, index) => (
        <sprite
          position={[x, height, 0]}
          scale={[2 * scale, scale]}
          key={index}
          ref={el => (cloudsRef.current[index] = el)}
        >
          <spriteMaterial map={texture} />
        </sprite>
      ))}
    </>
  );
}
