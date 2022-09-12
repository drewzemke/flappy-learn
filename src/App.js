import { Route, Routes } from 'react-router-dom';
import GameContainer from './components/GameContainer';
import MainMenu from './components/menus/MainMenu';
import SettingsMenu from './components/menus/SettingsMenu';
import styled from 'styled-components';

// NEED TO BRING THESE IN FROM SOMEWHERE ELSE...
const SCREEN_WIDTH = 8;
const SCREEN_HEIGHT = 4.5;

const AppContainer = styled.div`
  width: ${100 * SCREEN_WIDTH}px;
  height: ${100 * SCREEN_HEIGHT}px;
  background: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 10px;
  overflow: hidden;
`;

export default function App() {
  return (
    <AppContainer>
      <Routes>
        <Route
          path='/'
          element={<MainMenu />}
        />
        <Route
          path='/humangame'
          element={<GameContainer isPlayerHuman={true} />}
        />
        <Route
          path='/aigame'
          element={<GameContainer isPlayerHuman={false} />}
        />

        <Route
          path='/settings'
          element={<SettingsMenu />}
        />
      </Routes>
    </AppContainer>
  );
}
