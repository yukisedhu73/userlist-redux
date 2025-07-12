import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get('/users?per_page=50&&page=1');
    return response.data;
  }
);
