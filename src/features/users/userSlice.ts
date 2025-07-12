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
  allUsers: User[];         // Full list (API + local)
  paginatedList: User[];    // Current page users
  localUsers: User[];
  loading: boolean;
  error: string | null;
  page: number;
  per_page: number;
  total: number;
}

// Utils
const loadLocalUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('local_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: User[]) => {
  localStorage.setItem('local_users', JSON.stringify(users));
};

const paginate = (list: User[], page: number, per_page: number) => {
  const start = (page - 1) * per_page;
  return list.slice(start, start + per_page);
};

// Initial State
const initialState: UsersState = {
  allUsers: [],
  paginatedList: [],
  localUsers: loadLocalUsers(),
  loading: false,
  error: null,
  page: 1,
  per_page: 6,
  total: 0,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      state.paginatedList = paginate(state.allUsers, state.page, state.per_page);
    },
    addLocalUser: (state, action: PayloadAction<User>) => {
      state.localUsers.unshift(action.payload);
      saveLocalUsers(state.localUsers);

      state.allUsers = [action.payload, ...state.allUsers.filter(u => u.id !== action.payload.id)];
      state.total = state.allUsers.length;
      state.paginatedList = paginate(state.allUsers, state.page, state.per_page);
    },
    updateLocalUser: (state, action: PayloadAction<User>) => {
      const index = state.localUsers.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.localUsers[index] = action.payload;
        saveLocalUsers(state.localUsers);
      }

      const allIndex = state.allUsers.findIndex((u) => u.id === action.payload.id);
      if (allIndex !== -1) {
        state.allUsers[allIndex] = action.payload;
      }

      state.paginatedList = paginate(state.allUsers, state.page, state.per_page);
    },
    removeLocalUser: (state, action: PayloadAction<number | string>) => {
      state.localUsers = state.localUsers.filter(u => u.id !== action.payload);
      saveLocalUsers(state.localUsers);

      state.allUsers = state.allUsers.filter(u => u.id !== action.payload);
      state.total = state.allUsers.length;
      state.paginatedList = paginate(state.allUsers, state.page, state.per_page);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const fetched = action.payload.data;
        const combined = [...state.localUsers, ...fetched.filter((apiUser:any) => !state.localUsers.find(local => local.id === apiUser.id))];

        state.allUsers = combined;
        state.total = combined.length;
        state.paginatedList = paginate(combined, state.page, state.per_page);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  }
});

export const { setPage, addLocalUser, updateLocalUser, removeLocalUser } = userSlice.actions;
export default userSlice.reducer;
