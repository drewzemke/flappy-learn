import CanvasOverlay from './CanvasOverlay';
import { ReactComponent as PauseSVG } from '../../../assets/icons/google-material-pause.svg';

export function PlayerScoreOverlay({ score, handlePauseButton }) {
  return (
    <CanvasOverlay noShade>
      <button
        onClick={handlePauseButton}
        className='overlay-item pause-button'
        value='pause'
      >
        <PauseSVG />
      </button>
      <div className='overlay-item overlay-score'>Score: {score}</div>
    </CanvasOverlay>
  );
}

export function AIScoreOverlay({
  score,
  round,
  numAlive,
  numBirds,
  handlePauseButton,
}) {
  // This is annoying, but we should calculate the width of
  // the 'values' column of the scoreboard based on the maximum number of birds
  // (This prevents the scoreboard from resizing during the round)
  // ((Also I'm guessing at the width of the character in rem, hope that doesn't cause issues))
  const charWidth = 0.6;
  const valueMinWidth = charWidth * Math.floor(Math.log10(numBirds) + 1);

  return (
    <CanvasOverlay noShade>
      <button
        onClick={handlePauseButton}
        className='overlay-item pause-button'
        value='pause'
      >
        <PauseSVG />
      </button>
      <div className='overlay-item overlay-score'>
        <div className='overlay-score-titles'>
          <p>Generation:</p>
          <p>Score:</p>
          <p>Num. Alive:</p>
        </div>
        <div
          className='overlay-score-values'
          style={{ minWidth: `${valueMinWidth}rem` }}
        >
          <p>{round}</p>
          <p>{score}</p>
          <p>{numAlive}</p>
        </div>
      </div>
    </CanvasOverlay>
  );
}
