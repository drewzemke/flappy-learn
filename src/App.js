import { Route, Routes, Link, NavLink } from 'react-router-dom';
import GameController from './components/GameController';
import MainMenu from './components/menus/MainMenu';
import GameSettingsMenu from './components/menus/GameSettingsMenu';

// Randomly-chosen subtitles, a la Minecraft. Why not.
const subtitles = [
  'A cute little machine learning experiment!',
  `It's like Flappy Bird but with a nerdy twist!`,
  `"Watch 'em learn" instead of "watch and learn"!`,
];

export default function App() {
  return (
    <div className='app-container'>
      <div className='header'>
        <div className='header-title'>
          <h1>
            <Link to={'/'}>Learnin' Birds</Link>
          </h1>
          <div className='header-subtitle'>
            {subtitles[Math.floor(Math.random() * subtitles.length)]}
          </div>
        </div>
        <nav className='header-nav'>
          <ul>
            <li>
              <NavLink
                to={'/'}
                className={({ isActive }) =>
                  'header-link' + (isActive ? ' active' : '')
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={'/settings'}
                className={({ isActive }) =>
                  'header-link' + (isActive ? ' active' : '')
                }
              >
                Settings
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to={'/about'}
                className={({ isActive }) =>
                  'header-link' + (isActive ? ' active' : '')
                }
              >
                About
              </NavLink>
            </li> */}
          </ul>
        </nav>
      </div>
      <Routes>
        <Route
          path='/'
          element={<MainMenu />}
        />
        <Route
          path='/humangame'
          element={<GameController isPlayerHuman={true} />}
        />
        <Route
          path='/aigame'
          element={<GameController isPlayerHuman={false} />}
        />

        <Route
          path='/settings'
          element={<GameSettingsMenu />}
        />
      </Routes>
      <div className='footer'>&copy; 2022 Drew Zemke</div>
    </div>
  );
}
