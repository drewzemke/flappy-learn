import DrewSlider from '../ui-elements/DrewSlider';
import { round } from '../../utils/mathServices';

export default function Setting({
  value,
  settingKey,
  name,
  min,
  max,
  onChange,
  onFinish,
}) {
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
