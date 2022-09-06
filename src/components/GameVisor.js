import { Html } from '@react-three/drei';
import { RunState } from '../game-model/FlappyGameModel';
import '../styles/visorStyles.css';

export function GameVisor({ round, score, runState }) {
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
        <ScoreContent
          round={round}
          score={score}
        />
      )}
    </>
  );
}

function IntroVisorContent() {
  return (
    <Html fullscreen={true}>
      <div className='visor'>
        <div className='visor-big'>FLAPPIN' BIRDS</div>
        <div className='visor-small'>
          <div>
            {/* Press <span>Enter</span> to start and <span>Space</span> to jump */}
            Press <span>Enter</span> to start the first round!
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
        <div className='visor-big'>ROUND OVER</div>
        <div className='visor-small'>
          <div>
            Everyone died. The highest score was <span>{score}</span>. Press{' '}
            <span>Enter</span> to start the next round.
          </div>
        </div>
      </div>
    </Html>
  );
}

function ScoreContent({ score, round }) {
  return (
    <Html fullscreen={true}>
      <div className='score'> Round: {round}</div>
      <div className='score'> Score: {score}</div>
    </Html>
  );
}
