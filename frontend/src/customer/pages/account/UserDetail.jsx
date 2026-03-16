import React from "react";
import ProfileFiledCard from "./ProfileFiledCard";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../Redux Toolkit/store";

const UserDetail = () => {
  const { user } = useAppSelector((state) => state);

  return (
    <div className="space-y-1">
      <div className="flex items-end justify-end">
        <Button>Edit Details</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileFiledCard keys="Name" value={user.user?.name} />
        <ProfileFiledCard keys="Email" value={user.user?.email} />
        <ProfileFiledCard keys="Mobile" value={user.user?.mobile} />
        <ProfileFiledCard keys="Alternate_Number" value={user.user?.alternateNumber} />
        <ProfileFiledCard keys="Address" value={user.user?.address} />
      </div>
    </div>
  );
};

export default UserDetail;
