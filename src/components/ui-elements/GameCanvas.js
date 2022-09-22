import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { NoToneMapping } from 'three';
import styled from 'styled-components';
import { LayoutConstants } from '../../styles/shared/layoutConstants';
import { clamp } from '../../utils/mathServices';

const GameCanvasDiv = styled.div`
  width: ${props => props.canvasWidth}px;
  height: ${props => props.canvasHeight}px;
  background: var(--main-color);
`;

export default function GameCanvas({
  gameHeight,
  gameWidth,
  gameCanvasRef,
  children,
}) {
  // Dynamic Canvas plan
  // 1. go to state -> settings and rename 'gameWidth' and 'gameHeight' to
  //    'gamewidth' and 'gameheight' -- DONE
  // 2. fix everything that breaks as a result of this --DONE
  // 3. in this class, dynamically set the width of GameCanvasDiv to fit in the
  //    screen (somehow), and choose the height to maintain the correct
  //    aspect ratio based on gameWidth / gameHeight -- DONE
  // 4. add a window listener and update on resize -- DONE???

  // This hook automatically tracks with the width of the canvas
  // which is like 90% of the window width
  const unnormalizedWidth = useCanvasWidth();
  const canvasWidth =
    LayoutConstants.CANVAS_WIDTH_PROPORTION *
    clamp(
      unnormalizedWidth,
      LayoutConstants.MIN_CANVAS_WIDTH,
      LayoutConstants.MAX_CANVAS_WIDTH
    );

  // Compute the canvas height based on the game's aspect ratio
  const canvasHeight = (gameHeight / gameWidth) * canvasWidth;

  return (
    <GameCanvasDiv
      canvasWidth={canvasWidth}
      canvasHeight={canvasHeight}
      ref={gameCanvasRef}
    >
      <Canvas
        gl={{ antialias: true, toneMapping: NoToneMapping }}
        orthographic
        camera={{
          zoom: canvasWidth / gameWidth,
          position: [0, 0, 1],
          top: gameHeight / 2,
          bottom: -gameHeight / 2,
          left: -gameWidth / 2,
          right: gameWidth / 2,
        }}
      >
        {children}
        <CameraAutoZoomer gameWidth={gameWidth} />
      </Canvas>
    </GameCanvasDiv>
  );
}

// DO I NEED THIS??? Is there really not a way to dynamically update
// the Canvas's camera's zoom from outside of the Canvas?
function CameraAutoZoomer({ gameWidth }) {
  const { camera } = useThree();
  const unnormalizedWidth = useCanvasWidth();
  const canvasWidth =
    LayoutConstants.CANVAS_WIDTH_PROPORTION *
    clamp(
      unnormalizedWidth,
      LayoutConstants.MIN_CANVAS_WIDTH,
      LayoutConstants.MAX_CANVAS_WIDTH
    );
  camera.zoom = canvasWidth / gameWidth;

  return <></>;
}

// Secret custom hook, don't tell no one
function useCanvasWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}
