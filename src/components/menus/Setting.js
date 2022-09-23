import DrewSlider from '../ui-elements/DrewSlider';
import ReactTooltip from 'react-tooltip';
import { round } from '../../utils/mathServices';
import { ReactComponent as TooltipSVG } from '../../assets/icons/google-material-question-mark.svg';

export default function Setting({
  value,
  settingKey,
  name,
  min,
  max,
  onChange,
  onFinish,
  tooltip,
}) {
  return (
    <div className='setting overlay-item'>
      <div className='setting-text'>
        {name}:&nbsp;<span className='setting-value'>{round(value, 1)}</span>
        <span
          className='setting-tooltip'
          data-tip={tooltip}
          data-event='click'
        >
          <TooltipSVG />
        </span>
        <ReactTooltip
          place='top'
          type='dark'
          effect='solid'
          globalEventOff='click'
        />
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
        thumbHoverStyle={{ boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.2)' }}
      />
    </div>
  );
}
