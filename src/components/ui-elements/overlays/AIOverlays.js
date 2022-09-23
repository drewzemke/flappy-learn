import CanvasOverlay from './CanvasOverlay';
import { round } from '../../../utils/mathServices';
import { useEffect } from 'react';

export function AIPausedOverlay({ handleResume, handleBackToSettings }) {
  return (
    <CanvasOverlay clickable>
      <div className='overlay-message'>
        <p>Simulation paused.</p>
        <button
          value='start'
          onClick={handleResume}
          className='overlay-item overlay-button'
        >
          Resume
        </button>
        <button
          value='start'
          onClick={handleBackToSettings}
          className='overlay-item overlay-button'
        >
          Back to Simulation Settings
        </button>
      </div>
    </CanvasOverlay>
  );
}

export function AIDeadOverlay({
  handleButton,
  handleCheckbox,
  autoAdvance,
  scoreHistory,
}) {
  const score = scoreHistory[scoreHistory.length - 1];
  const bestScore = Math.max(...scoreHistory);

  useEffect(() => {
    // If we're in autoadvance mode, set a timer to trigger the next round
    if (autoAdvance) {
      const timerId = setTimeout(
        () => handleButton(undefined, 'restart'),
        1000
      );
      return () => clearTimeout(timerId);
    }
  }, [autoAdvance, handleButton]);

  return (
    <CanvasOverlay clickable>
      <div className='overlay-message'>
        <p>
          Round over. The average score was <span>{round(score, 3)}</span>. The
          best average score this session is <span>{round(bestScore, 3)}</span>.
        </p>
        <button
          value='restart'
          onClick={handleButton}
          className='overlay-item overlay-button'
        >
          Start the next round!
        </button>
        <div className='overlay-checkbox-message'>
          <div
            className={`overlay-checkbox ${autoAdvance ? 'checked' : ''}`}
            onClick={handleCheckbox}
          ></div>
          Automatically advance to the next round after 1 second.
        </div>
      </div>
    </CanvasOverlay>
  );
}
