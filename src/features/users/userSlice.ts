import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers } from './userThunk';

interface User {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UsersState {
  list: User[]; // list from API + localStorage combined
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  per_page: number;
  localUsers: User[]; // users added locally and persisted in localStorage
}

// Load from localStorage
const loadLocalUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('local_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
  per_page: 6,
  localUsers: loadLocalUsers(),
};

const saveLocalUsers = (users: User[]) => {
  localStorage.setItem('local_users', JSON.stringify(users));
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    addLocalUser: (state, action: PayloadAction<User>) => {
      state.localUsers.unshift(action.payload);
      saveLocalUsers(state.localUsers);
      state.total += 1;
      state.list = [...state.localUsers, ...state.list.filter(u => !state.localUsers.find(lu => lu.id === u.id))];
    },
    updateLocalUser: (state, action: PayloadAction<User>) => {
      const index = state.localUsers.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.localUsers[index] = action.payload;
        saveLocalUsers(state.localUsers);
      }
      // Also update in list
      const listIndex = state.list.findIndex((user) => user.id === action.payload.id);
      if (listIndex !== -1) {
        state.list[listIndex] = action.payload;
      }
    },
    removeLocalUser: (state, action: PayloadAction<number | string>) => {
      state.list = state.list.filter((user) => user.id !== action.payload);
      state.total -= 1;
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
        const fetchedUsers = action.payload.data;
        state.total = action.payload.total + state.localUsers.length;
        state.per_page = action.payload.per_page;

        const merged = [...state.localUsers, ...fetchedUsers.filter(
          (u: any) => !state.localUsers.find(lu => lu.id === u.id)
        )];

        state.list = merged;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setPage, addLocalUser, updateLocalUser, removeLocalUser } = userSlice.actions;
export default userSlice.reducer;