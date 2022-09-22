import BackgroundPanel from './threejs-elements/BackgroundPanel';
import Bird from './threejs-elements/Bird';
import Pipe from './threejs-elements/Pipe';

export default function GameDisplay({ birds, pipes, gameSettings, isRunning }) {
  return (
    <>
      <BackgroundPanel
        animated={isRunning}
        gameWidth={gameSettings.gameWidth}
        gameHeight={gameSettings.gameHeight}
      />
      {birds.map((bird, index) => (
        <Bird
          key={index}
          position={bird.position}
          vertVelocity={bird.vertVelocity}
          isAlive={bird.isAlive}
          gameSettings={gameSettings}
        />
      ))}
      {pipes.map((pipe, index) => (
        <Pipe
          key={index}
          position={pipe.position}
          gameSettings={gameSettings}
        />
      ))}
    </>
  );
}
