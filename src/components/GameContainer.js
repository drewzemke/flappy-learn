import GameEngine from '../components/GameEngine';
import { GameState } from '../state/gameStore';
import { useStore } from '../state/stateManagement';
import { useEffect } from 'react';
import GameCanvas from './ui-elements/GameCanvas';
import CanvasContainer from './ui-elements/CanvasContainer';
import PlayerIntroOverlay from './ui-elements/overlays/PlayerIntroOverlay';

export default function GameContainer({ isPlayerHuman }) {
  const { gameHeight, gameWidth } = useStore(state => state.gameSettings);
  const { pauseGame } = useStore(state => state.actions);
  const gameState = useStore(state => state.gameState);

  useEffect(() => {
    window.addEventListener('blur', pauseGame);
    return () => window.removeEventListener('blur', pauseGame);
    // eslint-disable-next-line
  }, []);

  return (
    <CanvasContainer>
      <GameCanvas
        gameWidth={gameWidth}
        gameHeight={gameHeight}
      >
        <GameEngine isPlayerHuman={isPlayerHuman} />
      </GameCanvas>
      {gameState === GameState.PLAYER_INTRO_SCREEN ? (
        <PlayerIntroOverlay></PlayerIntroOverlay>
      ) : null}
    </CanvasContainer>
  );
}
