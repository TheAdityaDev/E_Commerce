// BackgroundPicker.jsx
import React, { useState, useEffect } from "react";

const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const randomGradient = () =>
  `linear-gradient(45deg, ${randomColor()}, ${randomColor()})`;

const BackgroundPicker = ({ onSelect }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 5; i++) {
      generated.push(randomColor());
      generated.push(randomGradient());
    }
    setOptions(generated);
  }, []);

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "10px 0" }}>
      {options.map((color, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(color)}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            cursor: "pointer",
            background: color,
            border: "2px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundPicker;