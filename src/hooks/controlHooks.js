import { useEffect } from 'react';

export function usePlayerControl(jumpHandler) {
  useEffect(() => {
    window.addEventListener('keydown', jumpHandler);
    return () => window.removeEventListener('keydown', jumpHandler);
  });
}

export function useTimedControl(jumpHandler) {
  useEffect(() => {
    const id = setInterval(jumpHandler, 500);
    return () => clearInterval(id);
  });
}
