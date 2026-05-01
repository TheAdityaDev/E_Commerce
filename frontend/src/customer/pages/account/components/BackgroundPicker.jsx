import React, { useEffect, useState } from "react";

const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const randomGradient = () =>
  `linear-gradient(45deg, ${randomColor()}, ${randomColor()})`;

const BackgroundPicker = ({ onSelect }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push({ type: "solid", value: randomColor() });
      list.push({ type: "gradient", value: randomGradient() });
    }
    setColors(list);
  }, []);

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {colors.map((item, i) => (
        <div
          key={i}
          onClick={() => onSelect(item)}
          style={{
            width: 35,
            height: 35,
            borderRadius: "20%",
            cursor: "pointer",
            background: item.value,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundPicker;