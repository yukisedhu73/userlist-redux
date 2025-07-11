import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 1) => {
    const response = await axios.get(`/users?page=${page}`);
    return response.data;
  }
);