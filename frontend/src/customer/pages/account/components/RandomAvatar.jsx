// RandomAvatar.jsx
import React, { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

const RandomAvatar = ({ onSelect }) => {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 12; i++) {
      const svg = createAvatar(adventurer, {
        seed: Math.random().toString(),
      }).toDataUri();
      generated.push(svg);
    }
    setAvatars(generated);
  }, []);

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {avatars.map((avatar, i) => (
        <img
          key={i}
          src={avatar}
          alt="avatar"
          onClick={() => onSelect(avatar)}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            cursor: "pointer",
            border: "2px solid #ccc",
          }}
        />
      ))}
    </div>
  );
};

export default RandomAvatar;