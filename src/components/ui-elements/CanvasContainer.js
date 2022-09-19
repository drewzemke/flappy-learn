export default function CanvasContainer({ containerRef, children }) {
  return (
    <div
      ref={containerRef}
      className='canvas-container'
    >
      {children}
    </div>
  );
}
