import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Star, X } from "lucide-react";

const PostForm = ({ formik, showPostModal, setShowPostModal, product }) => {
  const [previewList, setPreviewList] = useState([]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previewList.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewList]);

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const existing = formik.values.posts.media || [];

    // merge + limit to 5 files
    const updatedFiles = [...existing, ...files].slice(0, 5);

    formik.setFieldValue("posts.media", updatedFiles);

    // create previews
    const previews = updatedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setPreviewList(previews);

    // reset input so same file can be selected again
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = formik.values.posts.media.filter(
      (_, index) => index !== indexToRemove,
    );

    formik.setFieldValue("posts.media", updatedFiles);

    const updatedPreviews = previewList.filter(
      (_, index) => index !== indexToRemove,
    );

    setPreviewList(updatedPreviews);
  };

  return (
    <AnimatePresence>
      {showPostModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute right-6 top-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                  Share Your Experience
                </h3>
                <p className="text-slate-500 text-sm">
                  How do you feel about your {product?.title || "product"}?
                </p>
              </div>

              {/* Rating */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Rate It
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer transition-colors ${
                        formik.values.rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => formik.setFieldValue("rating", star)}
                    />
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <TextField
                  label="Your Review"
                  fullWidth
                  multiline
                  rows={1}
                  required
                  value={formik.values.posts.title}
                  onChange={(e) =>
                    formik.setFieldValue("posts.title", e.target.value)
                  }
                />

                <textarea
                  value={formik.values.posts.content}
                  required
                  onChange={(e) =>
                    formik.setFieldValue("posts.content", e.target.value)
                  }
                  placeholder="Tell your experience..."
                  className="w-full h-32 p-4 bg-slate-50 rounded-2xl mt-4 focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                />

                {/* Preview */}
                <div className="flex gap-4 flex-wrap">
                  {previewList.map((item, index) => (
                    <div key={index}>
                      {item.type.startsWith("image") ? (
                        <span className="relative ">
                          <X
                            size={16}
                            onClick={() => handleRemoveFile(index)}
                            className="absolute z-20 -top-1 -right-1 bg-red-500 text-white rounded-full cursor-pointer"
                          />
                          <img
                            src={item.url}
                            alt="preview"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </span>
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="w-32 h-32 rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Upload */}
                <label className="flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 border-2 border-dashed border-slate-200">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <ImageIcon size={18} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">
                    Add Media (max 5)
                  </span>
                </label>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 2,
                    bgcolor: "#0f172a",
                    borderRadius: 4,
                    fontWeight: "bold",
                  }}
                  disabled={!formik.values.posts.content?.trim()}
                >
                  Submit Post
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostForm;
