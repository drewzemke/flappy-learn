import { useState } from 'react';
import { useStore } from '../../state/stateManagement';
import CanvasContainer from '../ui-elements/CanvasContainer';
import CanvasOverlay from '../ui-elements/overlays/CanvasOverlay';
import DrewSlider from '../ui-elements/DrewSlider';
import SettingsSampleScreen from './SettingsSampleScreen';

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
    min: 0.5,
    max: 2,
  },
  {
    settingKey: 'pipeGapSize',
    name: 'Pipe Spacing (Vert.)',
    min: 0,
    max: 4,
  },
  {
    settingKey: 'pipeSpacing',
    name: 'Pipe Spacing (Horiz.)',
    min: 1,
    max: 5,
  },
];

export default function SettingsMenu() {
  // Keeps track of whether a value is being altered (by dragging a slider)
  const [dragging, setDragging] = useState(false);

  const { gameSettings, setGameSettings } = useStore(state => ({
    gameSettings: state.gameSettings,
    setGameSettings: state.setGameSettings,
  }));

  const onSettingsChange = (settingKey, newValue) => {
    // Update the setting that was modified.
    const newGameSettings = {
      ...gameSettings,
      [settingKey]: newValue,
    };

    setGameSettings(newGameSettings);
    setDragging(true);
  };

  const onFinish = () => {
    setDragging(false);
  };

  return (
    <>
      <CanvasContainer>
        <SettingsSampleScreen
          gameSettings={gameSettings}
          lowOpacity={dragging}
        />
        <CanvasOverlay lowOpacity={dragging}>
          <div className={'settings-list'}>
            {availableSettings.map(settingInfo => (
              <Setting
                key={settingInfo.settingKey}
                value={gameSettings[settingInfo.settingKey]}
                onChange={onSettingsChange}
                onFinish={onFinish}
                {...settingInfo}
              />
            ))}
          </div>
        </CanvasOverlay>
      </CanvasContainer>
    </>
  );
}

function Setting({ value, settingKey, name, min, max, onChange, onFinish }) {
  const round = (val, places = 0) =>
    Math.round(10 ** places * val) / 10 ** places;

  return (
    <div className='setting overlay-item'>
      <div className='setting-text'>
        {name}:&nbsp;<span className='setting-value'>{round(value, 1)}</span>
      </div>
      <DrewSlider
        value={value}
        min={min}
        max={max}
        onChange={newVal => onChange(settingKey, newVal)}
        onFinish={onFinish}
        trackHeight={8}
        trackWidth={180}
        thumbWidth={15}
        thumbHeight={15}
        thumbColor={'var(--highlight-color)'}
        thumbStyle={{ borderRadius: '3px' }}
      />
    </div>
  );
}
