import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

export const fetchUsers = createAsyncThunk('users/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const createUser = createAsyncThunk('users/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/users', payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/users/${id}`, payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/users/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const resetUserPassword = createAsyncThunk('users/resetPassword', async (id, { rejectWithValue }) => {
  try { const { data } = await api.post(`/users/${id}/reset-password`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const userSlice = createSlice({
  name: 'users',
  initialState: { items: [], total: 0, page: 1, pages: 1, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createUser.fulfilled, (state, action) => { state.items.unshift(action.payload); state.total += 1; })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u._id !== action.payload);
        state.total -= 1;
      });
  },
});

export default userSlice.reducer;
