import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

// Load persisted auth from localStorage
const storedUser = (() => {
  try {
    const u = localStorage.getItem('quaarks_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
})();
const storedToken = localStorage.getItem('quaarks_token') || null;

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { token, user: { _id, name, email, role } }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid credentials');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('quaarks_user');
      localStorage.removeItem('quaarks_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('quaarks_user', JSON.stringify(action.payload.user));
        localStorage.setItem('quaarks_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
