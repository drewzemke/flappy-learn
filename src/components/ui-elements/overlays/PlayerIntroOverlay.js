import CanvasOverlay from './CanvasOverlay';

export default function PlayerIntroOverlay() {
  return (
    <CanvasOverlay>
      <div className='overlay-text'>
        Press <span>Enter</span> to start and <span>Space</span> to jump. Don't
        hit the floor, the ceiling, or the pipes. Good luck!
      </div>
    </CanvasOverlay>
  );
}
