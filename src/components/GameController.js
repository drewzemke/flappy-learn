import { useEffect, useRef } from 'react';
import GameDisplay from './GameDisplay';
import { useStore } from '../game-logic/state/stateManagement';
import { GameState } from '../game-logic/state/gameStore';
import GameCanvas from './ui-elements/GameCanvas';
import CanvasContainer from './ui-elements/CanvasContainer';
import {
  PlayerDeadOverlay,
  PlayerIntroOverlay,
  PlayerPausedOverlay,
} from './ui-elements/overlays/PlayerOverlays';
import {
  AIScoreOverlay,
  PlayerScoreOverlay,
} from './ui-elements/overlays/ScoreOverlays';
import useControls from '../hooks/useControls';
import AISettingsMenu from './menus/AISettingsMenu';
import {
  AIDeadOverlay,
  AIPausedOverlay,
} from './ui-elements/overlays/AIOverlays';
import AIAbout from './ui-elements/abouts/AIAbout';

// This is the main component for interacting with the game state.
// It captures player control and passes it to the state, displays
// various overlays based on the game state, and finally passes information
// to the GameDisplay component to show the pipe, bird, etc positions.
export default function GameController({ isPlayerHuman }) {
  // We need the height and width to properly adjust the canvas size
  const { gameSettings, simSettings, setSimSettings } = useStore(state => ({
    gameSettings: state.gameSettings,
    simSettings: state.simulationSettings,
    setSimSettings: state.setSimSettings,
  }));
  const { gameWidth, gameHeight } = gameSettings;

  const actions = useStore(state => state.actions);

  // Initialize the model
  useEffect(() => {
    actions.init(isPlayerHuman);
    return actions.unInit;
    // eslint-disable-next-line
  }, []);

  // Display various overlays based on the game state
  const gameState = useStore(state => state.gameState);

  // We need to pass information to the overlay screens as necessary
  const { score, scoreHistory, round, numAlive } = useStore(state => ({
    score: state.score,
    scoreHistory: state.scoreHistory,
    round: state.round,
    numAlive: state.birds.filter(bird => bird.isAlive).length,
  }));

  // We need to make a ref to the GameCanvas internal div to pass into
  // the game engine (for click handling purposes)
  const gameCanvasRef = useRef();

  useControls(actions, isPlayerHuman, gameState, gameCanvasRef);

  // Get the information we need to pass to the GameDisplay
  const { birds, pipes } = useStore(state => ({
    birds: state.birds,
    pipes: state.pipes,
  }));

  // A callback for the overlay pause button
  const handlePauseButton = event => {
    event.preventDefault();
    actions.pauseGame();
  };

  const handleStart = event => {
    event?.preventDefault();
    actions.start();
  };

  const handleRestart = event => {
    event?.preventDefault();
    actions.prepNextRound();
    actions.start();
  };

  const handleCheckbox = event => {
    const newSimSettings = {
      ...simSettings,
      autoAdvance: !simSettings.autoAdvance,
    };
    setSimSettings(newSimSettings);
  };

  return (
    <>
      <CanvasContainer>
        <GameCanvas
          gameWidth={gameWidth}
          gameHeight={gameHeight}
          gameCanvasRef={gameCanvasRef}
        >
          <GameDisplay
            birds={birds}
            pipes={pipes}
            gameSettings={gameSettings}
            isRunning={
              gameState === GameState.PLAYER_PLAYING ||
              gameState === GameState.AI_PLAYING
            }
          />
        </GameCanvas>

        {isPlayerHuman ? (
          <PlayerScoreOverlay
            handlePauseButton={handlePauseButton}
            score={score}
          />
        ) : (
          <AIScoreOverlay
            handlePauseButton={handlePauseButton}
            score={score}
            round={round}
            numAlive={numAlive}
            numBirds={birds.length}
          />
        )}

        {gameState === GameState.PLAYER_INTRO_SCREEN ? (
          <PlayerIntroOverlay handleButton={handleStart} />
        ) : null}

        {gameState === GameState.PLAYER_PAUSED ? (
          <PlayerPausedOverlay handleButton={handleStart} />
        ) : null}

        {gameState === GameState.PLAYER_DEAD ? (
          <PlayerDeadOverlay
            handleButton={handleRestart}
            scoreHistory={scoreHistory}
          />
        ) : null}

        {gameState === GameState.AI_SETTINGS ? (
          <AISettingsMenu handleButton={handleStart} />
        ) : null}

        {gameState === GameState.AI_PAUSED ? (
          <AIPausedOverlay handleButton={handleStart} />
        ) : null}

        {gameState === GameState.AI_DEAD ? (
          <AIDeadOverlay
            handleButton={handleRestart}
            handleCheckbox={handleCheckbox}
            autoAdvance={simSettings.autoAdvance}
            scoreHistory={scoreHistory}
          />
        ) : null}
      </CanvasContainer>
      {isPlayerHuman ? null : <AIAbout />}
    </>
  );
}
