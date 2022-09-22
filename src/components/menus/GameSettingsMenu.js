import { useState } from 'react';
import { useStore } from '../../game-logic/state/stateManagement';
import CanvasContainer from '../ui-elements/CanvasContainer';
import CanvasOverlay from '../ui-elements/overlays/CanvasOverlay';
import Setting from './Setting';
import GameSettingsSampleScreen from './GameSettingsSampleScreen';

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
    max: 7,
  },
  {
    settingKey: 'birdJumpVel',
    name: 'Jump Velocity',
    min: 0,
    max: 20,
  },
  {
    settingKey: 'gravity',
    name: 'Gravity',
    min: 0,
    max: 30,
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

export default function GameSettingsMenu() {
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
        <GameSettingsSampleScreen
          gameSettings={gameSettings}
          lowOpacity={dragging}
        />
        <CanvasOverlay
          clickable
          lowOpacity={dragging}
        >
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
