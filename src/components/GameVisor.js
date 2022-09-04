import { Html } from '@react-three/drei';
import { RunState } from '../game-model/FlappyGameModel';
import '../styles/visorStyles.css';

export function GameVisor({ score, runState }) {
  return (
    <>
      {runState !== RunState.RUNNING ? (
        <>
          {runState === RunState.DEAD ? (
            <DeadVisorContent score={score} />
          ) : (
            <IntroVisorContent />
          )}
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[8, 4.5, 1, 1]} />
            <meshBasicMaterial
              transparent={true}
              opacity={0.8}
              color={'black'}
            />
          </mesh>
        </>
      ) : (
        <ScoreContent score={score} />
      )}
    </>
  );
}

function IntroVisorContent() {
  return (
    <Html fullscreen={true}>
      <div className='visor'>
        <div className='visor-big'>FLAPPIN' BIRB</div>
        <div className='visor-small'>
          <div>
            Press <span>Enter</span> to start and <span>Space</span> to jump
          </div>
        </div>
      </div>
    </Html>
  );
}

function DeadVisorContent({ score }) {
  return (
    <Html fullscreen={true}>
      <div className='visor'>
        <div className='visor-big'>YOU DIED</div>
        <div className='visor-small'>
          <div>
            Your score was <span>{score}</span>. Press <span>Enter</span> to
            start again.
          </div>
        </div>
      </div>
    </Html>
  );
}

function ScoreContent({ score }) {
  return (
    <Html fullscreen={true}>
      <div className='score'> Score: {score}</div>
    </Html>
  );
}
