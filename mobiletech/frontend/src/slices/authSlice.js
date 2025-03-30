import { createSlice } from "@reduxjs/toolkit";
import { clearCart } from './cartSlice';  // Import clearCart to clear cart on logout

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: true,
        isAuthenticated: false,
        user: null,
        error: null,
    },
    reducers: {
        loginRequest(state, action) {
            state.loading = true;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFail(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        clearError(state, action) {
            state.error = null;
        },
        registerRequest(state, action) {
            state.loading = true;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        registerFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loadUserRequest(state, action) {
            state.isAuthenticated = false;
            state.loading = true;
        },
        loadUserSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loadUserFail(state, action) {
            state.loading = false;
        },
        logoutSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFail(state, action) {
            state.error = action.payload;
        },
        updateProfileRequest(state, action) {
            state.loading = true;
            state.isUpdated = false;
        },
        updateProfileSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.isUpdated = true;
        },
        updateProfileFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearUpdateProfile(state, action) {
            state.isUpdated = false;
        },
        updatePasswordRequest(state, action) {
            state.loading = true;
            state.isUpdated = false;
        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.isUpdated = true;
        },
        updatePasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        forgotPasswordRequest(state, action) {
            state.loading = true;
            state.message = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state, action) {
            state.loading = true;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        resetPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(clearCart, (state) => {
            state.loading = false;
        });
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutFail,
    logoutSuccess,
    updateProfileFail,
    updateProfileRequest,
    updateProfileSuccess,
    clearUpdateProfile,
    updatePasswordFail,
    updatePasswordSuccess,
    updatePasswordRequest,
    forgotPasswordFail,
    forgotPasswordSuccess,
    forgotPasswordRequest,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
} = authSlice.actions;

export default authSlice.reducer;
