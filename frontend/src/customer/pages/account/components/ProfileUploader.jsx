// ProfileUploader.jsx
import React, { useState, useRef, useEffect } from "react";
import { User, Pen } from "lucide-react";
import BackgroundPicker from "./BackgroundPicker";
import RandomAvatar from "./RandomAvatar";

const ProfileUploader = ({ onProfileChange }) => {
  const [baseImage, setBaseImage] = useState(null); // original avatar
  const [image, setImage] = useState(null); // preview with bg
  const [bg, setBg] = useState(null);
  const [showBg, setShowBg] = useState(false);

  const fileRef = useRef();
  const canvasRef = useRef();

  // Load saved profile
  useEffect(() => {
    const saved = localStorage.getItem("profileImage");
    if (saved) setImage(saved);
  }, []);

  // Real-time update for navbar
  const updateGlobal = (img) => {
    localStorage.setItem("profileImage", img);
    window.dispatchEvent(new CustomEvent("profileUpdated", { detail: img }));
    onProfileChange && onProfileChange(img);
  };

  // Upload file
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target.result;
      setBaseImage(data); // store original
      setImage(data);
      setShowBg(true);
      updateGlobal(data);
    };
    reader.readAsDataURL(file);
  };

  // Select random avatar
  const handleAvatar = (img) => {
    setBaseImage(img); // store original
    setImage(img);
    setShowBg(true);
    updateGlobal(img);
  };

  // Apply background
  const applyBgPreview = (selectedBg) => {
    setBg(selectedBg);
    if (!baseImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (selectedBg.type === "solid") {
        ctx.fillStyle = selectedBg.value;
      } else {
        const colors = selectedBg.value.match(/#[0-9a-fA-F]{6}/g);
        const grad = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
      }

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0); // always draw baseImage

      const preview = canvas.toDataURL();
      setImage(preview); // update big preview
      updateGlobal(preview); // update navbar
    };

    img.src = baseImage; // 🔥 use clean base image
  };

  // Save profile permanently
  const handleSave = () => {
    if (!baseImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (bg?.type === "solid") {
        ctx.fillStyle = bg.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bg?.type === "gradient") {
        const colors = bg.value.match(/#[0-9a-fA-F]{6}/g);
        const grad = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const preview = canvas.toDataURL();
      setImage(preview); // update big preview
      updateGlobal(preview); // update navbar
      setShowBg(false);
    };

    img.src = baseImage; // always draw clean base image
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Update Profile</h2>

      {/* Profile Preview */}
      <div style={styles.avatarWrapper}>
        {image ? (
          <img src={image} alt="Profile" style={styles.avatar} />
        ) : (
          <div style={styles.placeholder}>
            <User size={50} />
          </div>
        )}

        {/* Pen Button */}
        <button style={styles.penBtn} onClick={() => fileRef.current.click()}>
          <Pen size={16} className="right-1.5 top-1.5 absolute" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFile}
        />
      </div>

      <p style={{ fontSize: 13, color: "#777", marginTop: 4, marginBottom: 8 }}>
        Upload image or choose a random avatar
      </p>

      {/* Random Avatar Selection */}
      <RandomAvatar onSelect={handleAvatar} />

      {/* Background Picker */}
      {showBg && (
        <>
          <h4 className="mt-5 mb-4">Select Background</h4>
          <BackgroundPicker onSelect={applyBgPreview} />
        </>
      )}

      <button style={styles.saveBtn} onClick={handleSave}>
        Save Profile
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

const styles = {
  card: {
    maxWidth: 350,
    margin: "30px",
    padding: 20,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 15,
  },
  avatarWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    margin: "auto",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #eee",
    marginTop: "10%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  penBtn: {
    position: "absolute",
    bottom: 10,
    right: 5,
    borderRadius: "50%",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    width: 30,
    height: 30,
    cursor: "pointer",
  },
  saveBtn: {
    marginTop: 15,
    padding: "8px 16px",
    border: "none",
    borderRadius: 8,
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ProfileUploader;
