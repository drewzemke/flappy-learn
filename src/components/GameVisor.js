import { Html } from '@react-three/drei';
import { RunState } from '../game-model/FlappyGameModel';
import '../styles/visorStyles.css';

export function GameVisor({
  round,
  score,
  lastRoundScore,
  runState,
  numAlive,
}) {
  return (
    <>
      {runState !== RunState.RUNNING ? (
        <>
          {runState === RunState.DEAD || runState === RunState.RESTARTING ? (
            <DeadVisorContent score={lastRoundScore} />
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
          lastRoundScore={lastRoundScore}
          numAlive={numAlive}
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

function ScoreContent({ score, round, lastRoundScore, numAlive }) {
  return (
    <Html fullscreen={true}>
      <div className='score'> Round: {round}</div>
      <div className='score'> Prev. High Score: {lastRoundScore}</div>
      <div className='score'> Score: {score}</div>
      <div className='score'> Alive: {numAlive}</div>
    </Html>
  );
}
