
import { Link } from "react-router-dom";
import UpdateFieldCard from "./components/UpdateUserDetails";
import { useAppSelector } from "../../../Redux Toolkit/store";

const UserDetail = () => {
  const { user } = useAppSelector((state) => state);
  

  return (
    <div className="space-y-1">
      <div className="flex items-end justify-end">
        <Link className="m-4 text-teal-300 underline underline-offset-2 decoration-wavy" to="/update-profile">Edit Details</Link>
      </div>
        {/* <ProfileFiledCard keys="Profile" value={user.user?.image} /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpdateFieldCard keys="Name" value={user.user} />
        <UpdateFieldCard keys="Email" value={user.user?.email} />
        <UpdateFieldCard keys="Mobile" value={user.user?.mobile} />
        <UpdateFieldCard keys="Alternate_Number" value={user.user?.alternateNumber} />
        <UpdateFieldCard keys="Address" value={user.user?.address[0]} />
      </div>
    </div>
  );
};

export default UserDetail;
