import React from "react";
import { useAppSelector } from "../../Redux Toolkit/store";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  Building2,
  Home,
  Hash,
  Flag,
  Calendar,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

const Address = () => {
  const user = useAppSelector((state) => state.user.user || {});

  const addressData = Array.isArray(user?.address)
    ? user.address[0]
    : user?.address;

  if (!addressData) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="bg-white shadow-lg border rounded-2xl p-6 space-y-5"
    >
      {/* TITLE */}
      <motion.div variants={item} className="flex items-center gap-2">
        <MapPin className="text-teal-500 w-6 h-6" />
        <h2 className="text-xl font-semibold">Address Details</h2>
      </motion.div>

      {/* ADDRESS */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Home className="text-teal-500 w-5 h-5" />
        <p className="text-gray-700">{addressData.address}</p>
      </motion.div>

      {/* LOCALITY */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Building2 className="text-teal-500 w-5 h-5" />
        <p className="text-gray-700">{addressData.locality}</p>
      </motion.div>

      {/* CITY + STATE */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Globe className="text-teal-500 w-5 h-5" />
        <p className="text-gray-700">
          {addressData.city}, {addressData.state}
        </p>
      </motion.div>

      {/* COUNTRY */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Flag className="text-teal-500 w-5 h-5" />
        <p className="text-gray-700">{addressData.country}</p>
      </motion.div>

      {/* PINCODE */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Hash className="text-teal-500 w-5 h-5" />
        <p className="text-gray-700">{addressData.pincode}</p>
      </motion.div>

      {/* CREATED DATE */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Calendar className="text-teal-500 w-5 h-5" />
        <p className="text-gray-500 text-sm">
          Created: {new Date(addressData.createdAt).toLocaleDateString()}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Address;