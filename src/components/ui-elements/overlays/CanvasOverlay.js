export default function CanvasOverlay({
  lowOpacity = false,
  noShade = false,
  clickable = false,
  children,
}) {
  return (
    <div
      className={
        'overlay' +
        (lowOpacity ? ' low-opacity' : '') +
        (noShade ? ' no-shade' : '') +
        (clickable ? '' : ' no-click')
      }
    >
      {children}
    </div>
  );
}
