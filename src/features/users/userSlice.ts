import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from './userThunk';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  per_page: number;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
  per_page: 6,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.per_page = action.payload.per_page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setPage } = userSlice.actions;
export default userSlice.reducer;