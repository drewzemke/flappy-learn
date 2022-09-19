import GameCanvas from '../ui-elements/GameCanvas';

export default function MainMenuSampleScreen({ gameSettings, children }) {
  const { gameWidth, gameHeight } = gameSettings;

  return (
    <div className='main-menu-sample-screen'>
      <GameCanvas
        gameHeight={gameHeight}
        gameWidth={gameWidth}
      >
        {children}
      </GameCanvas>
    </div>
  );
}
