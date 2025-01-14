import React, { useState, useRef, useEffect } from 'react';

const ProgressBar = ({ min = 0, max = 100, step = 1, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value || min);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value);
    }
  }, [value]);

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    updateSliderValue(e);
  };

  const handleMouseMove = (e) => {
    updateSliderValue(e);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const updateSliderValue = (e) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    let newValue = ((e.clientX - sliderRect.left) / sliderRect.width) * (max - min) + min;
    newValue = Math.max(min, Math.min(max, newValue));
    newValue = Math.round(newValue / step) * step;

    setSliderValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const calculateThumbPosition = () => {
    return ((sliderValue - min) / (max - min)) * 100;
  };

  return (
    <div
      ref={sliderRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '8px',
        backgroundColor: '#ddd',
        cursor: 'pointer',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          position: 'absolute',
          width: `${calculateThumbPosition()}%`,
          height: '100%',
          backgroundColor: '#007bff',
        }}
      />
    </div>
  );
};

export default ProgressBar;