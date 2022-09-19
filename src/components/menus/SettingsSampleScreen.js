import Bird from '../game-elements/Bird';
import Pipe from '../game-elements/Pipe';
import PipeModel from '../../game-logic/PipeModel';
import GameCanvas from '../ui-elements/GameCanvas';

export default function SettingsSampleScreen({ gameSettings }) {
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

  return (
    <GameCanvas
      gameHeight={gameHeight}
      gameWidth={gameWidth}
    >
      <Bird
        position={{ x: gameSettings.birdX, y: gameSettings.birdInitialY }}
        gameSettings={gameSettings}
      />
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
