// src/store/reducers/authReducer.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("authToken"),
        isAuthenticated: false,
        isLoading: true,
        error: null,
    },
    reducers: {
        setAuthTokens: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem("authToken", action.payload.token);
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setAuthTokens, clearAuth, setLoading, setError } =
    authSlice.actions;
export default authSlice.reducer;
