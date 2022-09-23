// import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import * as meshline from 'meshline';
import Bird from '../threejs-elements/Bird';
import Pipe from '../threejs-elements/Pipe';
import PipeModel from '../../game-logic/PipeModel';
import GameCanvas from '../ui-elements/GameCanvas';
import BackgroundPanel from '../threejs-elements/BackgroundPanel';
import { useMemo } from 'react';
import { extend } from '@react-three/fiber';

// I don't know why I need to do this... :(
extend(meshline);

export default function GameSettingsSampleScreen({ gameSettings }) {
  const { gameWidth, gameHeight } = gameSettings;

  const numPipes = Math.ceil(gameWidth / gameSettings.pipeSpacing);
  const initialX = 0;
  const pipes = [];
  // Using some predefined 'randomness' for the
  // y-positions
  const yPosition = index =>
    gameSettings.pipeMaxAbsY * Math.sin(11 * index ** 2);
  for (let i = 0; i < numPipes; i++) {
    const pipe = new PipeModel(initialX + i * gameSettings.pipeSpacing, 0);
    pipe.position = { x: pipe.position.x, y: yPosition(i) };
    pipes.push(pipe);
  }

  const birdTrajectoryMesh = useMemo(() => {
    // Create points for the sample trajectory of the bird:
    const points = [];
    const delta = 0.01;
    const trajStart = 0.05;
    const trajEnd = 1;
    for (let t = trajStart; t < trajEnd; t += delta) {
      const pointX = gameSettings.birdX + gameSettings.pipeSpeed * t;
      const pointY =
        gameSettings.birdInitialY +
        gameSettings.birdJumpVel * t -
        0.5 * gameSettings.gravity * t * t;
      points.push(pointX, pointY, 0);
    }

    return points;
  }, [gameSettings]);

  return (
    <GameCanvas
      gameHeight={gameHeight}
      gameWidth={gameWidth}
    >
      <BackgroundPanel
        gameWidth={gameWidth}
        gameHeight={gameHeight}
      />
      <Bird
        position={{ x: gameSettings.birdX, y: gameSettings.birdInitialY }}
        gameSettings={gameSettings}
      />
      <mesh>
        <meshLine
          attach='geometry'
          points={birdTrajectoryMesh}
        />
        <meshLineMaterial
          attach='material'
          transparent
          lineWidth={0.1}
          color={'red'} // replace with palette color (yellow-ish)?
          dashArray={0.1}
          dashRatio={0.3}
        />
      </mesh>
      {pipes.map((pipe, index) => (
        <Pipe
          key={index}
          position={pipe.position}
          gameSettings={gameSettings}
        />
      ))}
    </GameCanvas>
  );
}
