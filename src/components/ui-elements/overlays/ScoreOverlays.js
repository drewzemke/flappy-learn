import CanvasOverlay from './CanvasOverlay';
import { ReactComponent as PauseSVG } from '../../../assets/icons/google-material-pause.svg';

export function PlayerScoreOverlay({ score, handlePauseButton }) {
  return (
    <CanvasOverlay noShade>
      <button
        onClick={handlePauseButton}
        className='overlay-item overlay-button'
        value='pause'
      >
        <PauseSVG />
      </button>
      <div className='overlay-item overlay-score'>Score: {score}</div>
    </CanvasOverlay>
  );
}

export function AIScoreOverlay({ score, handlePauseButton }) {
  return (
    <CanvasOverlay noShade>
      <button
        onClick={handlePauseButton}
        className='overlay-item overlay-button'
        value='pause'
      >
        <PauseSVG />
      </button>
      <div className='overlay-item overlay-score'>Score: {score}</div>
    </CanvasOverlay>
  );
}
