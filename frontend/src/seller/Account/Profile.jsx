import { motion } from "framer-motion";
import { Avatar, Button, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAppSelector } from "../../Redux Toolkit/store";
import ProfileFiledCard from "../../customer/pages/account/ProfileFiledCard";

const Profile = () => {
  const { profile } = useAppSelector((state) => state?.seller || {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  if (!profile) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="lg:px-20 pt-6 pb-20 space-y-8"
    >
      {/* HEADER CARD */}
      <motion.div
        variants={cardVariants}
        className="bg-white p-6 rounded-2xl shadow-md border"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* AVATAR + NAME */}
          <div className="flex items-center gap-5">
            <Avatar
              sx={{
                height: 100,
                width: 100,
                fontSize: "2rem",
                bgcolor: "#1976d2",
              }}
            >
              {profile?.sellerName?.charAt(0)}
            </Avatar>

            <div>
              <h2 className="text-xl font-bold">
                {profile?.sellerName}
              </h2>
              <p className="text-gray-500">{profile?.email}</p>

              <Chip
                label={profile?.accountStatus}
                color={profile?.accountStatus === "ACTIVE" ? "success" : "error"}
                size="small"
                className="mt-2"
              />
            </div>
          </div>

          {/* EDIT BUTTON */}
          <Button variant="contained">
            <EditIcon className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      {/* BUSINESS DETAILS */}
        <h3 className="text-lg font-semibold mb-4">Business Details</h3>
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-md border-2 border-dashed">

        <ProfileFiledCard keys="Business_Name" value={profile?.businessDetails?.businessName} />
        <ProfileFiledCard keys="Email" value={profile?.businessDetails?.businessEmail} />
        <ProfileFiledCard keys="Mobile" value={profile?.businessDetails?.businessPhone} />
        <ProfileFiledCard keys="Address" value={profile?.businessDetails?.businessAddress} />
      </motion.div>

      {/* BANK DETAILS */}
        <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-md border-2 border-dashed">

        <ProfileFiledCard keys="Account_Holder" value={profile?.bankDetails?.accountHolderName} />
        <ProfileFiledCard keys="Account_Number" value={profile?.bankDetails?.accountNumber} />
        <ProfileFiledCard keys="Bank_Name" value={profile?.bankDetails?.bankName} />
        <ProfileFiledCard keys="IFSC_Code" value={profile?.bankDetails?.IFSC_Code} />
      </motion.div>

      {/* OTHER INFO */}
        <h3 className="text-lg font-semibold mb-4">Other Information</h3>
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-md border-2 border-dashed">

        <ProfileFiledCard keys="GSTIN" value={profile?.GSTIN} />
        <ProfileFiledCard keys="Mobile" value={profile?.mobile} />
        <ProfileFiledCard className="uppercase" keys="Role" value={profile?.role} />
        <ProfileFiledCard keys="Created_At" value={new Date(profile?.createdAt).toLocaleDateString()} />
        <ProfileFiledCard keys="Updated_At" value={new Date(profile?.updatedAt).toLocaleDateString()} />
      </motion.div>
    </motion.div>
  );
};

export default Profile;