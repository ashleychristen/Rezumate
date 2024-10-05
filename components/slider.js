// components/Slider.js
import { useState } from 'react';

const Slider = () => {
  const [value, setValue] = useState(0);

  const handleSliderChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    await fetch('/api/saveValue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={handleSliderChange}
      />
      <button onClick={handleSubmit}>Submit Value</button>
      <p>Current Value: {value}</p>
    </div>
  );
};

export default Slider;
