import CanvasOverlay from './CanvasOverlay';

export function PlayerIntroOverlay() {
  return (
    <CanvasOverlay>
      <div className='overlay-message'>
        <p>
          <span>Click</span>/<span>tap</span> the screen or press{' '}
          <span>space</span> to jump.
        </p>
        <p>Don't hit the floor, the ceiling, or pipes.</p>
        <p>Good luck :)</p>
      </div>
    </CanvasOverlay>
  );
}

export function PlayerPausedOverlay() {
  return (
    <CanvasOverlay>
      <div className='overlay-message'>
        <p>Game paused.</p>

        <p>
          <span>Click</span>, <span>tap</span>, or press <span>space</span> to
          resume.
        </p>
        <p>
          Or try adjusting the settings to increase or decrease the challenge!
        </p>
      </div>
    </CanvasOverlay>
  );
}

export function PlayerDeadOverlay({ score }) {
  return (
    <CanvasOverlay>
      <div className='overlay-message'>
        <p>You died.</p>
        <p>
          Your score was <span>{score}</span>. Your best score this session is{' '}
          <span>{0}</span>.
        </p>
        <p>
          <span>Click</span>, <span>tap</span>, or press <span>space</span> to
          try again!
        </p>
      </div>
    </CanvasOverlay>
  );
}
