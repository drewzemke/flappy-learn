import BackgroundPanel from '../threejs-elements/BackgroundPanel';
import GameCanvas from '../ui-elements/GameCanvas';

export default function MainMenuSampleScreen({ gameSettings, children }) {
  const { gameWidth, gameHeight } = gameSettings;

  return (
    <div className='main-menu-sample-screen'>
      <GameCanvas
        gameWidth={gameWidth}
        gameHeight={gameHeight}
      >
        {children}
        <BackgroundPanel
          animated
          gameWidth={gameWidth}
          gameHeight={gameHeight}
        />
      </GameCanvas>
    </div>
  );
}
