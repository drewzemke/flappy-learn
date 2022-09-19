import React from 'react';

export default function CanvasOverlay({ lowOpacity = false, children }) {
  return (
    <div className={'overlay' + (lowOpacity ? ' low-opacity' : '')}>
      {children}
    </div>
  );
}
