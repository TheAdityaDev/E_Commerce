import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../config/api.config";

const API_URL = "/posts";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "/posts/fetchPosts",
  async ({ token, productId, signal, userName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts?product=${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      const data = response.data;

      // ✅ Handle posts array correctly
      if (data.posts && Array.isArray(data.posts)) {
        data.posts = data.posts.map((p) => ({
          ...p,
          user: p.user || { name: userName || "Unknown User" },
        }));
      }

      return data;
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      if (error.name === "CanceledError") return;
      return rejectWithValue("Failed to fetch posts");
    }
  },
);;

export const createPost = createAsyncThunk(
  "/posts/createPost",
  async ({ token, payload, signal }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/new`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal, // 👈 AbortController signal goes here
      });

      return response.data;
    } catch (error) {
      // 👇 handle abort separately
      if (error.name === "CanceledError" || error.name === "AbortError") {
        return rejectWithValue("Request aborted");
      }

      return rejectWithValue(error.response?.data || "Failed to create post");
    }
  },
);

export const fetchUserAllPosts = createAsyncThunk(
  "/posts/fetchUserAllPosts",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      return response.data;
    } catch (error) {
      if (error.name === "CanceledError") return;
      return rejectWithValue("Failed to fetch posts");
    }
  },
);

export const UpdateUserPosts = createAsyncThunk(
  "/posts/UpdateUserPosts",
  async (
    { token, productId, postId, payload, signal },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/update/${postId}`,
        payload,
        {
          params: { productId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        },
      );

      return response.data;
    } catch (error) {
      if (error.name === "CanceledError") return;
      return rejectWithValue("Failed to fetch posts");
    }
  },
);

export const deleteUserPosts = createAsyncThunk(
  "/posts/deleteUserPosts",
  async (
    { token, postId, signal },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/delete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        },
      );

      return response.data;
    } catch (error) {
      if (error.name === "CanceledError") return;
      return rejectWithValue("Failed to fetch posts");
    }
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;

        const newPost = action.payload?.data;

        if (newPost) {
          state.posts.unshift(newPost);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create post";
      })
      .addCase(fetchUserAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.post;
        state.fetched = true;
      })
      .addCase(fetchUserAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
      .addCase(UpdateUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload?.data;
        if (updatedPost) {
          const index = state.posts.findIndex(
            (post) => post._id === updatedPost._id
          );
          if (index !== -1) {
            state.posts[index] = updatedPost;
          }
        }
        state.fetched = true;
      })
      .addCase(UpdateUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
      .addCase(deleteUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.post;
        state.fetched = true;
      })
      .addCase(deleteUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      });
  },
});

export default postSlice.reducer;
