import React, { useMemo, useState } from "react";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { TextField, Button } from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../Redux Toolkit/store";
import { updateUserProfile } from "../../../../Redux Toolkit/Features/Customer/userSlice";

const fieldConfig = {
  name: { label: "Name", value:"name", icon: <User className="w-5 h-5 text-teal-500" /> },
  email: { label: "Email", value:"email" ,icon: <Mail className="w-5 h-5 text-teal-500" /> },
  mobile: {
    label: "Mobile", value:"mobile",
    icon: <Phone className="w-5 h-5 text-teal-500" />,
  },
  alternateNumber: {
    label: "Alternate Number", value:"alternateNumber",
    icon: <Phone className="w-5 h-5 text-teal-500" />,
  },
  address: {
    label: "Address", value:"address",
    icon: <MapPin className="w-5 h-5 text-teal-500" />,
  },
};

const UpdateFieldCard = ({ fieldKey, label, icon, value }) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(
    (state) => state.user.user?.user?.id || state.user.user?.user?._id,
  );
  console.log("UserID:", userId);

  const [editValue, setEditValue] = useState(value ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    setIsEditing(false);
    dispatch(
      updateUserProfile({ 
        userId, 
        field: fieldKey,
        value: editValue
      })
    );
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
      <div className="bg-teal-50 p-3 rounded-lg">{icon}</div>
      <div className="flex flex-col flex-1 gap-2">
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          {label}
        </span>
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              enterKeyHint="enter"
              inputMode={"text"}
              regex={
                label === "Mobile" || label === "Alternate Number"
                  ? /^[0-9]*$/
                  : undefined
              }
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        ) : (
          <div
            className="text-sm sm:text-base font-semibold text-gray-800 break-all cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {editValue ?? "—"}
          </div>
        )}
      </div>
    </div>
  );
};

const UpdateUserDetails = ({ user: userProp }) => {
  const { user: userFromStore } = useAppSelector(
    (state) => state.user.user || {},
  );
  const user = userProp ?? userFromStore;

  const fields = useMemo(() => {
    if (!user) return [];

    return Object.entries(fieldConfig)
      .map(([key, config]) => ({
        key,
        label: config.label,
        icon: config.icon,
        value: user[key] ?? "",
      }))
      .filter((f) => f.value !== undefined && f.value !== null);
  }, [user]);

  if (!user) return <div>Loading your details...</div>;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Update Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-10 sm:flex-row">
        {fields.map(({ key, label, icon, value }) => (
          <UpdateFieldCard key={key} fieldKey={key} label={label} icon={icon} value={value} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    maxWidth: 1100,
    width: "100%",
    margin: "30px auto",
    padding: window.innerWidth <= 768 ? 10 : 20, // smaller padding on mobile
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "start",
    paddingLeft: "40px",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
};

export default UpdateUserDetails;
