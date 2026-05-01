import { useState } from "react";
import { Dialog, DialogContent, Button } from "@mui/material";
import { X } from "lucide-react";

const ProductImagesWithPopup = ({ images, title }) => {
  // Flatten nested array
  const flatImages = Array.isArray(images) ? images.flat() : [];

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % flatImages.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + flatImages.length) % flatImages.length);

  return (
    <>
      {/* Table Thumbnails */}
      <div className="flex items-center gap-3">
        {flatImages.map((imgUrl, i) => (
          <img
            key={i}
            src={imgUrl}
            alt={title}
            className="h-20 w-20 object-cover rounded-md cursor-pointer"
            onClick={() => handleOpen(i)} // click opens modal
          />
        ))}
      </div>

      {/* Modal Popup */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" className="relative">
        <div className="p-3 fixed top-0 right-0">
            <Button onClick={handleClose} color="error" variant="contained" >
            <X />
          </Button>
        </div>
        <DialogContent className="flex flex-col items-center relative ">
          <img
            src={flatImages[currentIndex]}
            alt={title}
            className="h-105 w-70 object-cover rounded-xl transition-transform duration-500 ease-in-out transform "
          />
          <div className="flex justify-between w-full mt-4">
            <Button onClick={handlePrev} variant="outlined">
              Previous
            </Button>
            <span>
              {currentIndex + 1} / {flatImages.length}
            </span>
            <Button onClick={handleNext} variant="outlined">
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImagesWithPopup;