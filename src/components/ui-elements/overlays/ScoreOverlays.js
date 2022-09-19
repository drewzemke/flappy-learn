import CanvasOverlay from './CanvasOverlay';
import { ReactComponent as PauseSVG } from '../../../assets/icons/google-material-pause.svg';

export function PlayerScoreOverlay({ score, handlePauseButton }) {
  return (
    <CanvasOverlay noShade>
      <div
        onClick={handlePauseButton}
        className='overlay-item overlay-button'
      >
        <PauseSVG />
      </div>
      <div className='overlay-item overlay-score'>Score: {score}</div>
    </CanvasOverlay>
  );
}
