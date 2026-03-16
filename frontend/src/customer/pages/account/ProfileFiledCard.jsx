import React from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";

const icons = {
  Name: <User className="w-5 h-5 text-teal-500" />,
  Email: <Mail className="w-5 h-5 text-teal-500" />,
  Mobile: <Phone className="w-5 h-5 text-teal-500" />,
  Alternate_Number: <Phone className="w-5 h-5 text-teal-500" />,
  Address: <MapPin className="w-5 h-5 text-teal-500" />,
};

const ProfileFiledCard = ({ keys, value }) => {
  return (
    <div
      className="
      w-full
      bg-white
      border
      border-gray-100
      rounded-xl
      shadow-sm
      p-4 sm:p-5
      flex
      items-center
      gap-4
      hover:shadow-md
      transition
    "
    >
      {/* Icon */}
      <div className="bg-teal-50 p-3 rounded-lg">
        {icons[keys]}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          {keys}
        </span>
        <span className="text-sm sm:text-base font-semibold text-gray-800 break-all">
          {value}
        </span>
      </div>
    </div>
  );
};

export default ProfileFiledCard;