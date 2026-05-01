import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Banknote,
  CreditCard,
  Hash,
  BadgeCheck,
  Briefcase,
  Calendar,
  RefreshCcw,
  Flag,
} from "lucide-react";

const icons = {
  // 👤 BASIC
  Name: <User className="w-5 h-5 text-teal-500" />,
  Email: <Mail className="w-5 h-5 text-teal-500" />,
  Mobile: <Phone className="w-5 h-5 text-teal-500" />,
  Role: <BadgeCheck className="w-5 h-5 text-teal-500" />,
  Alternate_Number: <Phone className="w-5 h-5 text-teal-500" />,
  Address: <MapPin className="w-5 h-5 text-teal-500" />,
  Country: <Flag className="w-5 h-5 text-teal-500" />,
  // 🏪 BUSINESS
  Business_Name: <Building2 className="w-5 h-5 text-teal-500" />,
  Business_Email: <Mail className="w-5 h-5 text-teal-500" />,
  Business_Phone: <Phone className="w-5 h-5 text-teal-500" />,
  Business_Address: <MapPin className="w-5 h-5 text-teal-500" />,
  GSTIN: <Hash className="w-5 h-5 text-teal-500" />,

  // 🏦 BANK
  Account_Holder: <User className="w-5 h-5 text-teal-500" />,
  Account_Number: <CreditCard className="w-5 h-5 text-teal-500" />,
  Bank_Name: <Banknote className="w-5 h-5 text-teal-500" />,
  IFSC_Code: <Hash className="w-5 h-5 text-teal-500" />,

  // 📦 OTHER
  Account_Status: <BadgeCheck className="w-5 h-5 text-teal-500" />,
  Pickup_Details: <Briefcase className="w-5 h-5 text-teal-500" />,

  // 📅 SYSTEM
  Created_At: <Calendar className="w-5 h-5 text-teal-500" />,
  Updated_At: <RefreshCcw className="w-5 h-5 text-teal-500" />,
};

const ProfileFiledCard = ({ keys, value }) => {
  // Handle address array - show count and first address details

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
      <div className="bg-teal-50 p-3 rounded-lg">{icons[keys]}</div>

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
