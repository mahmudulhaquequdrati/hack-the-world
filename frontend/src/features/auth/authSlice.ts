import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Initialize state from localStorage
const getInitialState = (): AuthState => {
  const token = localStorage.getItem("hackToken");

  // Only initialize with token, user data stays in Redux only
  if (token) {
    return {
      user: null, // User data will be fetched from API when needed
      token,
      isAuthenticated: true,
    };
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Only persist token to localStorage, user stays in Redux only
      localStorage.setItem("hackToken", token);
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // User data is NOT stored in localStorage
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear token from localStorage
      localStorage.removeItem("hackToken");
      // Remove old token names for cleanup (temporary migration code)
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },

    clearAuth: (state) => {
      // Same as logout but can be called from other slices
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("hackToken");
      // Remove old token names for cleanup (temporary migration code)
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, updateUser, logout, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
