import Bird from './game-elements/Bird';
import Pipe from './game-elements/Pipe';

export default function GameDisplay({ birds, pipes, gameSettings }) {
  return (
    <>
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
