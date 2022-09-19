import React from 'react';
import { Link } from 'react-router-dom';
import MainMenuSampleScreen from './MainMenuSampleScreen';
import { useStore } from '../../game-logic/state/stateManagement';
import CanvasOverlay from '../ui-elements/overlays/CanvasOverlay';
import CanvasContainer from '../ui-elements/CanvasContainer';

export default function MainMenu() {
  const gameSettings = useStore(state => state.gameSettings);

  return (
    <CanvasContainer>
      <MainMenuSampleScreen gameSettings={gameSettings} />
      <CanvasOverlay>
        <div className='main-menu-items'>
          <Link
            className='overlay-item main-menu-link'
            to='/humangame'
          >
            I want to play!
          </Link>
          <Link
            className='overlay-item main-menu-link'
            to='/aigame'
          >
            I want to watch the AI learn!
          </Link>
        </div>
      </CanvasOverlay>
    </CanvasContainer>
  );
}
