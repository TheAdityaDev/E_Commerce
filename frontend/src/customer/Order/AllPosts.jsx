import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Image as ImageIcon,
  MessageSquare,
  ThumbsUp,
  LayoutGrid,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  deleteUserPosts,
  fetchUserAllPosts,
  UpdateUserPosts,
} from "../../Redux Toolkit/Features/Customer/postsSlice";
import secureLocalStorage from "react-secure-storage";
import {
  PostMediaGallery,
  StarRating,
} from "../pages/Product/ProductDetail/ProductDetail";

// --- Time Formatting Logic ---
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

// --- Sub-component for Media Carousel ---

const AllPosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts || []);

  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchUserAllPosts({ token }));
    }
  }, [dispatch, token]);

  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [editValue, setEditValue] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // --- Real-time Tick ---
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Handlers ---
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

  const openEdit = (post) => {
    setEditModal({ open: true, post });
    setEditValue(post.content || "");
    setEditTitle(post.title || "");
    setEditRating(post.rating || 0);
    handleMenuClose();
  };

  const saveEdit = async () => {
    const post = editModal.post;
    if (!post) return;

    dispatch(
      UpdateUserPosts({
        token,
        postId: post._id || post.id,
        userId: post.user._id || post.user.id,
        productId: post.product._id || post.product.id,
        payload: {
          title: editTitle,
          content: editValue,
          rating: editRating,
        },
      }),
    );

    dispatch(fetchUserAllPosts({ token }));

    setEditModal({ open: false, post: null });
  };

  const deletePost = (id) => {
    // Logic to dispatch delete post action would go here
    handleMenuClose();
    dispatch(deleteUserPosts({ token, postId: id }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <User size={20} />
            </div>
            <div>
              <h1 className="font-black uppercase tracking-tighter text-lg">
                My Activity
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {posts.length} Total Posts
              </p>
            </div>
          </div>
          <Button
            variant="outlined"
            startIcon={<LayoutGrid size={16} />}
            sx={{
              borderRadius: 3,
              borderColor: "#f1f5f9",
              color: "#64748b",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Filter
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <AnimatePresence mode="popLayout">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <ImageIcon size={32} />
              </div>
              <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">
                No posts yet.
              </p>
            </motion.div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post._id || post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group"
              >
                {/* Post Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-100">
                      {(post?.user?.name || post?.user?.fullName)?.[0] || "U"}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">
                        {post?.user?.name ||
                          post?.user?.fullName ||
                          "Unknown User"}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm font-bold text-gray-700">
                          {post.title}
                        </p>
                        {(post.isEdited || post.updatedAt > post.createdAt) && (
                          <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border border-amber-100">
                            Edited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <IconButton
                    onClick={(e) => handleMenuOpen(e, post._id || post.id)}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <MoreVertical size={20} className="text-slate-400" />
                  </IconButton>
                </div>

                {/* Content */}
                <div className="px-8 pb-4">
                  <p className="text-slate-600 leading-relaxed font-medium italic text-lg mb-6">
                    {post.content}
                  </p>

                  {/* Media Pagination */}
                  <PostMediaGallery media={post.media} />
                </div>

                {/* Footer Stats */}
                {/* Add in future */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                  {/* Left side */}
                  {/* <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400 group/btn cursor-pointer">
                      <ThumbsUp
                        size={16}
                        className="group-hover/btn:text-teal-500 transition-colors"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {post.likes} Likes
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 group/btn cursor-pointer">
                      <MessageSquare
                        size={16}
                        className="group-hover/btn:text-blue-500 transition-colors"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {post.replies} Replies
                      </span>
                    </div>
                  </div> */}

                  {/* Right side (time) */}
                  <div className="flex items-center justify-between w-full gap-2 text-slate-400">
                    <span className="text-[10px] flex items-center gap-2 font-black uppercase tracking-widest">
                    <Clock size={12} className="text-slate-300" />
                      {formatTimeAgo(post.createdAt)}
                    </span>
                     <span className="text-[10px] font-black uppercase tracking-widest">
                      Created At:
                      {new Date(post.createdAt).toLocaleTimeString([],{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Updated At:
                      {new Date(post.updatedAt).toLocaleTimeString([],{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </main>

      {/* Menu for Operations */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 4,
            mt: 1.5,
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            minWidth: 160,
          },
        }}
      >
        <MenuItem
          onClick={() =>
            openEdit(posts.find((p) => (p._id || p.id) === activeMenuId))
          }
          sx={{ py: 1.5, gap: 1.5 }}
        >
          <Edit3 size={16} className="text-blue-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-600">
            Edit Post
          </span>
        </MenuItem>
        <MenuItem
          onClick={() => deletePost(activeMenuId)}
          sx={{ py: 1.5, gap: 1.5, color: "#ef4444" }}
        >
          <Trash2 size={16} />
          <span className="text-xs font-black uppercase tracking-widest">
            Delete Post
          </span>
        </MenuItem>
      </Menu>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100"
            >
              <button
                onClick={() => setEditModal({ open: false, post: null })}
                className="absolute right-8 top-8 p-2 bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                    Edit Log
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Refine your public experience
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Rating Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Verdict
                    </label>
                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-center">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditRating(star)}
                            className="transition-transform active:scale-90"
                          >
                            <Star
                              className={`w-8 h-8 ${star <= editRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all text-sm font-bold uppercase tracking-tight text-slate-900"
                      placeholder="Give it a title..."
                    />
                  </div>

                  {/* Content (Comment) Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Your Experience
                    </label>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full h-32 p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all text-sm font-medium italic resize-none text-slate-600"
                      placeholder="Tell us more about the product..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setEditModal({ open: false, post: null })}
                    sx={{
                      py: 1.8,
                      borderRadius: 4,
                      textTransform: "none",
                      fontWeight: "bold",
                      color: "#64748b",
                      borderColor: "#f1f5f9",
                    }}
                  >
                    Discard
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={saveEdit}
                    sx={{
                      py: 1.8,
                      borderRadius: 4,
                      bgcolor: "#0f172a",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontSize: "0.75rem",
                    }}
                  >
                    Update Post
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllPosts;
