import GameEngine from '../components/GameEngine';
import { GameState } from '../state/gameStore';
import { useStore } from '../state/stateManagement';
import { useEffect } from 'react';
import GameCanvas from './ui-elements/GameCanvas';
import CanvasContainer from './ui-elements/CanvasContainer';
import {
  PlayerDeadOverlay,
  PlayerIntroOverlay,
  PlayerPausedOverlay,
} from './ui-elements/overlays/PlayerOverlays';
import { useRef } from 'react';
import { PlayerScoreOverlay } from './ui-elements/overlays/ScoreOverlays';

export default function GameContainer({ isPlayerHuman }) {
  // We need the height and width to properly adjust the canvas size
  const { gameHeight, gameWidth } = useStore(state => state.gameSettings);

  // We'll pause the game if the window loses focus
  const { pauseGame } = useStore(state => state.actions);

  // Display various overlays based on the game state
  const gameState = useStore(state => state.gameState);

  // We need to pass information to the overlay screens as necessary
  const { score, lastRoundScore, round, numAlive } = useStore(state => ({
    score: state.score,
    lastRoundScore: state.lastRoundScore,
    round: state.round,
    numAlive: state.neuralNets.length,
  }));

  useEffect(() => {
    window.addEventListener('blur', pauseGame);
    return () => window.removeEventListener('blur', pauseGame);
    // eslint-disable-next-line
  }, []);

  // We need to make a ref to the CanvasContainer div to pass into
  // the game engine (for click handling purposes)
  const containerRef = useRef();

  return (
    <CanvasContainer containerRef={containerRef}>
      <GameCanvas
        gameWidth={gameWidth}
        gameHeight={gameHeight}
      >
        <GameEngine
          containerRef={containerRef}
          isPlayerHuman={isPlayerHuman}
        />
      </GameCanvas>
      {isPlayerHuman ? <PlayerScoreOverlay score={score} /> : null}
      {gameState === GameState.PLAYER_INTRO_SCREEN ? (
        <PlayerIntroOverlay />
      ) : null}
      {gameState === GameState.PLAYER_PAUSED ? <PlayerPausedOverlay /> : null}
      {gameState === GameState.PLAYER_DEAD ? (
        <PlayerDeadOverlay score={score} />
      ) : null}
    </CanvasContainer>
  );
}
