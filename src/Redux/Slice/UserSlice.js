import { createSlice } from "@reduxjs/toolkit";
import { login } from "../API/API";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        isAuthenticated: false,
        userData: null,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.userData = null;
            state.error = null;
            // Remove role from localStorage when user logs out
            localStorage.removeItem('role');
            localStorage.removeItem('email');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.isAuthenticated = false;
            state.userData = null;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.userData = action.payload.data;
            state.error = null;
            // Store only the role in localStorage for persistent login
            localStorage.setItem('role', JSON.stringify(action.payload.data.role));
            localStorage.setItem('email', JSON.stringify(action.payload.data.email));
            localStorage.setItem('eventId', JSON.stringify(action.payload.data.eventId));
            localStorage.setItem('id', JSON.stringify(action.payload.data.id));
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.userData = null;
            state.error = action.error.message;
        });
    }
});

// Export actions
export const { logout } = userSlice.actions;

export default userSlice.reducer;