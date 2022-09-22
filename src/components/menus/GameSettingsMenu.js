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
    tooltip: 'How fast the bird(s) move horizontally.',
  },
  {
    settingKey: 'birdJumpVel',
    name: 'Jump Velocity',
    min: 0,
    max: 20,
    tooltip:
      'How quickly a bird moves upwards after jumping. (Almost like jump height, but the actual jump height is affected by gravity.)',
  },
  {
    settingKey: 'gravity',
    name: 'Gravity',
    min: 0,
    max: 30,
    tooltip: 'How strongly gravity pulls the bird(s) down.',
  },
  {
    settingKey: 'pipeWidth',
    name: 'Pipe Width',
    min: 0.5,
    max: 2,
    tooltip: 'The width of a pipe.',
  },
  {
    settingKey: 'pipeSpacing',
    name: 'Pipe Spacing',
    min: 1,
    max: 5,
    tooltip: 'The horizontal space between consecutive pipes.',
  },
  {
    settingKey: 'pipeGapSize',
    name: 'Pipe Gap',
    min: 0,
    max: 4,
    tooltip: 'The size of the gap between top and bottom pipe segments.',
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
