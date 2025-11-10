import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLogin } from "../../utils/api";

export const adminLoginAsync = createAsyncThunk(
  "auth/adminLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminLogin(credentials);
      // Save to localStorage
      localStorage.setItem('authUser', JSON.stringify(response));
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || "Login failed");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('authUser')) || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem('authUser');
    },
    setAuth(state, action) {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLoginAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLoginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(adminLoginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;