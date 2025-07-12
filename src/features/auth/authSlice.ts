import { createSlice } from '@reduxjs/toolkit';
import { login as loginThunk } from './authThunk';

interface AuthState {
  token: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || '',
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        localStorage.setItem('token', action.payload);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;