import { Link } from 'react-router-dom';
import { useStore } from '../../state/stateManagement';
import { Canvas } from '@react-three/fiber';
import { Bird } from '../game-elements/Bird';
import { Pipe } from '../game-elements/Pipe';
import { PipeModel } from '../../game-model/PipeModel';

// An array to store the names of the available settings
// and the parameters used to set them.
// Each is an object with:
//  - key: the name of the setting in 'settingsStore.js'
//  - name: the display name of that setting
//  - min, max: smallest and largest values of the slider used to set that setting
//  - tooltip: description to (eventually!) add next to the setting
const availableSettings = [
  {
    settingKey: 'pipeSpeed',
    name: 'Horizontal Speed',
    min: 1,
    max: 5,
  },
  {
    settingKey: 'birdJumpVel',
    name: 'Jump Height',
    min: 0,
    max: 5,
  },
  {
    settingKey: 'gravity',
    name: 'Gravity',
    min: 0,
    max: 20,
  },
  {
    settingKey: 'pipeWidth',
    name: 'Pipe Width',
    min: 0,
    max: 5,
  },
  {
    settingKey: 'pipeGapSize',
    name: 'Pipe Spacing (Vertical)',
    min: 0,
    max: 5,
  },
  {
    settingKey: 'pipeSpacing',
    name: 'Pipe Spacing (Horizontal)',
    min: 0,
    max: 5,
  },
];

export default function SettingsMenu() {
  const { gameSettings, setGameSettings } = useStore(state => ({
    gameSettings: state.gameSettings,
    setGameSettings: state.setGameSettings,
  }));

  const onSettingsChange = event => {
    //
    // This will need to be changed once I weave in the sliders!
    //
    // Update the setting that was modified.
    const newGameSettings = {
      [event.target.name]: event.target.value,
      ...gameSettings,
    };
    setGameSettings(newGameSettings);
  };

  return (
    <>
      <div className='settings-menu-header'>Settings</div>
      <div className='settings-list'>
        {availableSettings.map(settingInfo => (
          <Setting
            key={settingInfo.settingKey}
            value={gameSettings[settingInfo.settingKey]}
            onChange={onSettingsChange}
            {...settingInfo}
          />
        ))}
      </div>
      <SettingsSampleScreen gameSettings={gameSettings} />
      <div className='back-button'>
        <Link to='../'>Back</Link>
      </div>
    </>
  );
}

function Setting({ value, settingKey, name, min, max, onChange }) {
  return (
    <div className='setting'>
      <div className='setting-name'>{name}</div>
      <input
        type='number'
        className='setting-input'
        name={settingKey}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function SettingsSampleScreen({ gameSettings }) {
  const { screenWidth, screenHeight } = gameSettings;

  // Make some pipes using the settings.
  const numPipes = Math.ceil(screenWidth / gameSettings.pipeSpacing);
  const initialX = -screenWidth / 4;
  const pipes = [];
  for (let i = 0; i < numPipes; i++) {
    pipes.push(
      new PipeModel(
        initialX + i * gameSettings.pipeSpacing,
        gameSettings.pipeMaxAbsY
      )
    );
  }

  return (
    <div
      className='settings-sample-screen'
      style={{ width: '400px', height: '225px' }}
    >
      <Canvas
        orthographic
        camera={{
          zoom: 50,
          position: [0, 0, 1],
          top: screenHeight / 2,
          bottom: -screenHeight / 2,
          left: -screenWidth / 2,
          right: screenWidth / 2,
        }}
      >
        <color
          attach={'background'}
          args={[0, 0, 0]}
        />
        <Bird
          position={{ x: gameSettings.birdX, y: gameSettings.birdInitialY }}
          isAlive={true}
          gameSettings={gameSettings}
        />
        {pipes.map((pipe, index) => (
          <Pipe
            key={index}
            position={pipe.position}
            gameSettings={gameSettings}
          />
        ))}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[screenWidth, screenHeight, 1, 1]} />
          <meshBasicMaterial
            // wireframe
            color={'skyblue'}
          />
        </mesh>
        )
      </Canvas>
    </div>
  );
}
