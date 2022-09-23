import CanvasOverlay from './CanvasOverlay';

export function PlayerIntroOverlay({ handleButton }) {
  return (
    <CanvasOverlay clickable>
      <div className='overlay-message'>
        <p>
          <span>Click</span>/<span>tap</span> the screen or press{' '}
          <span>space</span> to jump.
        </p>
        <p>
          Don't hit the floor, the ceiling, or pipes. <br /> Good luck :)
        </p>
        <button
          value='start'
          onClick={handleButton}
          className='overlay-item overlay-button'
        >
          Start!
        </button>
      </div>
    </CanvasOverlay>
  );
}

export function PlayerPausedOverlay({ handleButton }) {
  return (
    <CanvasOverlay clickable>
      <div className='overlay-message'>
        <p>Game paused.</p>
        <p>Try adjusting the settings to increase or decrease the challenge!</p>

        <button
          value='start'
          onClick={handleButton}
          className='overlay-item overlay-button'
        >
          Resume
        </button>
      </div>
    </CanvasOverlay>
  );
}

export function PlayerDeadOverlay({ handleButton, scoreHistory }) {
  const score = scoreHistory[scoreHistory.length - 1];
  const bestScore = Math.max(...scoreHistory);

  return (
    <CanvasOverlay clickable>
      <div className='overlay-message'>
        <p>You died.</p>
        <p>
          Your score was <span>{score}</span>. Your best score this session is{' '}
          <span>{bestScore}</span>.
        </p>

        <button
          value='restart'
          onClick={handleButton}
          className='overlay-item overlay-button'
        >
          Try again!
        </button>
      </div>
    </CanvasOverlay>
  );
}
