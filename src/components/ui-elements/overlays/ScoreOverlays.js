import CanvasOverlay from './CanvasOverlay';

export function PlayerScoreOverlay({ score }) {
  return (
    <CanvasOverlay noShade>
      <div className='overlay-item overlay-score'>Score: {score}</div>
    </CanvasOverlay>
  );
}
