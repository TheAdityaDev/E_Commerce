import Radio from "@mui/material/Radio";
import { toast } from "react-toastify";

const AddressCard = ({ value, selectedValue, handleChange, item }) => {
  const handleCardClick = () => {
    handleChange({ target: { value } });
    if (selectedValue === null) {
      toast.info("Please select the address.")
    }
  };

  const isSelected = selectedValue?._id === value?._id;

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer p-5 rounded-lg flex gap-4 
    ${
      isSelected
        ? "border-2 border-blue-500 bg-blue-50"
        : "border border-gray-300 flex items-center"
    }`}
    >
      <Radio
        checked={isSelected}
        value={value}
        onChange={handleChange}
        name="radio-buttons"
      />

      <div>
        <div>
          <h1 className="font-semibold">{item?.country}</h1>
          <p>
            <strong>City:</strong> {item?.city}
          </p>
          <p>
            <strong>Address:</strong> {item?.address}, {item?.locality},{" "}
            {item?.state} - {item?.pincode}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
