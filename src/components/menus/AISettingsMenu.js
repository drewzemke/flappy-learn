import { useStore } from '../../game-logic/state/stateManagement';
import CanvasOverlay from '../ui-elements/overlays/CanvasOverlay';
import Setting from './Setting';
import { roundToNearestMult } from '../../utils/mathServices';

// An array to store the names of the available settings
// and the parameters used to set them.
// Each is an object with:
//  - key: the name of the setting in 'settingsStore.js'
//  - name: the display name of that setting
//  - min, max: smallest and largest values of the slider used to set that setting
//  - tooltip: description to (eventually!) add next to the setting
const availableSettings = [
  {
    settingKey: 'numBirds',
    name: 'Generation Size',
    min: 2,
    max: 1000,
  },
  // {
  //   settingKey: 'neuralNetStandardDev',
  //   name: 'Inital Variance',
  //   min: 0,
  //   max: 10,
  // },
  {
    settingKey: 'childrenPerPair',
    name: 'Children Per Pair',
    min: 2,
    max: 100,
  },
  {
    settingKey: 'reproductionMutationRate',
    name: 'Mutation Rate',
    min: 0,
    max: 1,
  },
  {
    settingKey: 'reproductionMutationStdDev',
    name: 'Mutation Variance',
    min: 0,
    max: 10,
  },
];

export default function AISettingsMenu({ handleButton }) {
  const { gameSettings, simSettings, setSimSettings } = useStore(state => ({
    gameSettings: state.gameSettings,
    simSettings: state.simulationSettings,
    setSimSettings: state.setSimSettings,
  }));

  const onSettingsChange = (settingKey, newValue) => {
    const newSimSettings = { ...simSettings };

    // Need to do some preprocessing for certain keys:
    // - numBirds -- round to nearest multiple of childrenPerPair
    // - childrenPerPair -- round to nearest integer, also adjust numBirds
    if (settingKey === 'numBirds') {
      const childrenPerPair = simSettings.childrenPerPair;
      newValue = roundToNearestMult(newValue, childrenPerPair);

      // Make sure this doesn't send numBirds above the max or below the min
      const numBirdSettingInfo = availableSettings.find(
        setting => setting.settingKey === 'numBirds'
      );
      if (newValue > numBirdSettingInfo.max) {
        newValue -= childrenPerPair;
      }
      if (newValue < numBirdSettingInfo.min) {
        newValue += childrenPerPair;
      }
    }
    if (settingKey === 'childrenPerPair') {
      newValue = Math.round(newValue);
      let newNumBirds = roundToNearestMult(simSettings.numBirds, newValue);
      // Make sure this doesn't send numBirds above the max or below the min
      const numBirdSettingInfo = availableSettings.find(
        setting => setting.settingKey === 'numBirds'
      );
      if (newNumBirds > numBirdSettingInfo.max) {
        newNumBirds -= newValue;
      }
      if (newNumBirds < numBirdSettingInfo.min) {
        newNumBirds += newValue;
      }
      newSimSettings.numBirds = newNumBirds;
    }

    // Update the setting that was modified.
    newSimSettings[settingKey] = newValue;

    setSimSettings(newSimSettings);
  };

  return (
    <>
      <CanvasOverlay clickable>
        <div className={'settings-list'}>
          {availableSettings.map(settingInfo => (
            <Setting
              key={settingInfo.settingKey}
              value={simSettings[settingInfo.settingKey]}
              onChange={onSettingsChange}
              {...settingInfo}
            />
          ))}
          <button
            value='aiStart'
            onClick={handleButton}
            className='overlay-item main-menu-link'
          >
            Start!
          </button>
        </div>
      </CanvasOverlay>
    </>
  );
}
