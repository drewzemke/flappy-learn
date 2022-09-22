import CanvasOverlay from './CanvasOverlay';
import { round } from '../../../utils/mathServices';

export function AIPausedOverlay() {
  return (
    <CanvasOverlay>
      <div className='overlay-message'>
        <p>Simulation paused.</p>

        <p>
          <span>Click</span>, <span>tap</span>, or press <span>space</span> to
          resume.
        </p>
      </div>
    </CanvasOverlay>
  );
}

export function AIDeadOverlay({ scoreHistory }) {
  const score = scoreHistory[scoreHistory.length - 1];
  const bestScore = Math.max(...scoreHistory);

  return (
    <CanvasOverlay>
      <div className='overlay-message'>
        <p>Everyone died.</p>
        <p>
          The average score was <span>{round(score, 3)}</span>. The best average
          score this session is <span>{round(bestScore, 3)}</span>.
        </p>
        <p>
          <span>Click</span>, <span>tap</span>, or press <span>space</span> to
          start the next round!
        </p>
      </div>
    </CanvasOverlay>
  );
}
