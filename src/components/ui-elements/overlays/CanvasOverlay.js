export default function CanvasOverlay({
  lowOpacity = false,
  noShade = false,
  children,
}) {
  return (
    <div
      className={
        'overlay' +
        (lowOpacity ? ' low-opacity' : '') +
        (noShade ? ' no-shade' : '')
      }
    >
      {children}
    </div>
  );
}
