import ProfileFiledCard from "./ProfileFiledCard";
import { useAppSelector } from "../../../Redux Toolkit/store";
import { Link } from "react-router-dom";
import { Pen } from "lucide-react";

const UserDetail = () => {
  const { user, address } = useAppSelector((state) => state?.user?.user || {});
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-end">
        <Link
          className="m-4 flex bg-gray-500/30 px-3 py-2 rounded-md text-white items-center gap-1 hover:text-gray-700/50 duration-150"
          to="/update-profile"
        >
          <Pen size={15} />
          Edit Detail
        </Link>
      </div>
      {/* <ProfileFiledCard keys="Profile" value={user?.image} /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileFiledCard keys="Name" value={user.name} />
        <ProfileFiledCard keys="Email" value={user.email} />
        <ProfileFiledCard keys="Mobile" value={user.mobile} />
        <ProfileFiledCard keys="Address" value={address?.[0]?.address} />
        {user.alternateNumber && (
          <ProfileFiledCard
            keys="Alternate_Number"
            value={user.alternateNumber}
          />
        )}
        <ProfileFiledCard keys="Country" value={address?.[0]?.country} />
        {/* <ProfileFiledCard keys="Pincode" value={address?.[0]?.pincode} /> */}
      </div>
    </div>
  );
};

export default UserDetail;
