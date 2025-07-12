import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/login', { email, password });
      return response.data.token;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error || 'Invalid credentials');
    }
  }
);