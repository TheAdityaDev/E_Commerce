import Radio from "@mui/material/Radio";

const AddressCard = ({ value, selectedValue, handelChange ,item }) => {
  return (
    <div
      className={`cursor-pointer p-5 rounded-lg flex gap-4
        ${
          selectedValue == value
            ? "border-2 border-blue-500 bg-blue-50"
            : "border border-gray-300"
        }`}
    >
      <Radio
        checked={selectedValue == value}
        value={value}
        onChange={handelChange}
        name="radio-buttons"
      />

      <div>
        <h1 className="font-semibold">Aditya</h1>
        <p>Street 123, Mumbai</p>
        <p>
          <strong>Mobile:</strong> 2342543454
        </p>
      </div>
    </div>
  );
};

export default AddressCard;
