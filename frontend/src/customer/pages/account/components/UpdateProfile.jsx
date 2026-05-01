import React, { useEffect, useState } from "react";
import ProfileUploader from "./ProfileUploader";
import UpdateUserDetails from "./UpdateUserDetails";

const UpdateProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Load initial
    const saved = localStorage.getItem("profileImage");
    if (saved) setProfile(saved);

    // 🔥 LISTEN REALTIME
    const listener = (e) => {
      setProfile(e.detail);
    };

    window.addEventListener("profileUpdated", listener);

    return () => {
      window.removeEventListener("profileUpdated", listener);
    };
  }, []);

  return (
    <div className="flex-col flex lg:flex-row">
      <ProfileUploader onProfileChange={setProfile} />
      <UpdateUserDetails />
    </div>
  );
};

export default UpdateProfile;