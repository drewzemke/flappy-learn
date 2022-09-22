import styled from 'styled-components';
import { useRef } from 'react';

// Hey look, I made my own slider component!
// Heavily inspired by Robin Wieruch: https://www.robinwieruch.de/react-slider/
//

// Turns a number into a string followed by 'px', otherwise leaves the input alone
const autoPx = input => (typeof input === 'number' ? `${input}px` : input);

// The main container for the slider
const StyledSlider = styled.div`
  position: relative;
  height: ${props => props.trackHeight}px;
  width: ${props => autoPx(props.trackWidth)};
`;

//
const StyledTrack = styled.div`
  border-radius: 5px;
  overflow: hidden;
  background: ${props => props.trackColor};
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
`;

const TrackLeft = styled.div`
  background: ${props => props.trackColorLeft || props.trackColor};
`;

const TrackRight = styled.div`
  background: ${props => props.trackColorRight || props.trackColor};
  flex-grow: 1;
`;

const StyleThumb = styled.div`
  width: ${props => props.thumbWidth}px;
  height: ${props => props.thumbHeight}px;
  border: 1px solid white;
  border-radius: 100%;
  position: relative;
  top: -${props => (props.thumbHeight - props.trackHeight) / 2}px;
  background: ${props => props.thumbColor};
  cursor: pointer;
  touch-action: none;

  &:hover {
    ${props => props.thumbHoverStyle}
  }
`;

// Just a utility function. This probably exists in a library somewhere...
const clamp = (val, min, max) => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
};

const DrewSlider = ({
  // Current value of the slider (for controlling the component)
  value = 0,
  // Minimum output -- slider won't go below this
  min = 0,
  // Maximum output -- slider won't go above this
  max = 100,
  // Called whenever the mouse moves while 'holding' the slider thumb
  onChange,
  // Called when the user stops moving the slider thumb (and let's go of the mouse)
  onFinish,
  // Horizontal width of the track
  trackWidth = 200,
  // Vertical height of the track
  trackHeight = 10,
  // Background color of the track
  trackColor = 'grey',
  // The background color of the track to the left of the thumb
  trackColorLeft,
  // The background color of the track to the right of the thumb
  trackColorRight,
  // Extra CSS style to pass the track
  trackStyle,
  // Diameter of the thumb (the part of the slider that moves)
  // By default the thumb is circular, but this can be overridden (see 'thumbStyle')
  thumbDiam = 25,
  // These optionally set the height/width of the thumb individually
  // If not specified, the 'thumbDiam' is used in their place
  thumbHeight,
  thumbWidth,
  // Color of the thumb
  thumbColor = 'rgb(104, 117, 217)',
  // Extra CSS style to pass to the thumb
  thumbStyle,
  thumbHoverStyle,
}) => {
  // All the DOM references!
  const sliderRef = useRef();
  const thumbRef = useRef();
  const trackRef = useRef();
  const diff = useRef();

  // This doesn't seem like a good idea :(
  // But I think I need it for 'onFinish' to work
  const valueRef = useRef(value);

  // Sometimes we know the value of the slider in 'pixels', which
  // is literally the horizontal distance from its left endpoint
  // on the screen. Sometimes we know the 'value' itself, which is
  // what the output of the slider should read as.
  // These two functions convert between the two formats.
  const pixelsToValue = (x, pixelWidth, valueMax, valueMin) =>
    (x / pixelWidth) * (valueMax - valueMin) + valueMin;

  const sliderToPixels = (s, valueMax, valueMin, pixelWidth = trackWidth) =>
    ((s - valueMin) / (valueMax - valueMin)) * pixelWidth;

  // Called whenever the mouse moves after clicking on the thumb.
  // Computes the new value and sends it to the callback.
  const handleDrag = event => {
    event.preventDefault();
    event.stopPropagation();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    let newX =
      clientX - diff.current - sliderRef.current.getBoundingClientRect().left;
    const end = sliderRef.current.offsetWidth;
    const start = 0;

    newX = clamp(newX, start, end);
    valueRef.current = pixelsToValue(newX, end, max, min);

    if (onChange) onChange(valueRef.current);
  };

  // When the user clicks the thumb, record the displacement of the click relative to the
  // thumb's bounding box. Then setup listeners to keep track of when the user
  // moves and lets go of the thumb.
  const handleStart = event => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    diff.current =
      clientX -
      thumbRef.current.getBoundingClientRect().left -
      (thumbWidth || thumbDiam) / 2;
    if (!event.touches) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleEnd);
    }
  };

  // When the user lets go of the thumb, remove those listeners
  // and notify any subscribes that the slider is done sliding.
  const handleEnd = event => {
    if (onFinish) onFinish(valueRef.current);
    if (!event.touches) {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleEnd);
    }
  };

  return (
    <>
      <StyledSlider
        ref={sliderRef}
        trackWidth={trackWidth}
        trackHeight={trackHeight}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        <StyledTrack
          trackColor={trackColor}
          trackHeight={trackHeight}
          style={{ ...trackStyle }}
        >
          <TrackLeft
            ref={trackRef}
            trackColorLeft={trackColorLeft}
            trackColor={trackColor}
            trackHeight={trackHeight}
            style={{ width: sliderToPixels(value, max, min) }}
          />
          <TrackRight
            trackColorRight={trackColorRight}
            trackColor={trackColor}
            trackHeight={trackHeight}
          />
        </StyledTrack>
        <StyleThumb
          thumbColor={thumbColor}
          trackHeight={trackHeight}
          thumbWidth={thumbWidth || thumbDiam}
          thumbHeight={thumbHeight || thumbDiam}
          thumbHoverStyle={thumbHoverStyle}
          style={{
            left:
              sliderToPixels(value, max, min) - (thumbWidth || thumbDiam) / 2,
            ...thumbStyle,
          }}
          ref={thumbRef}
          onMouseDown={handleStart}
          onTouchMove={handleDrag}
          onTouchEnd={handleEnd}
        />
      </StyledSlider>
    </>
  );
};

export default DrewSlider;
