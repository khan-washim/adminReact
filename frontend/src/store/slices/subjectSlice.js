import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

export const fetchSubjects = createAsyncThunk('subjects/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/subjects');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createSubject = createAsyncThunk('subjects/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/subjects', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateSubject = createAsyncThunk('subjects/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/subjects/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteSubject = createAsyncThunk('subjects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/subjects/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => { state.loading = true; })
      .addCase(fetchSubjects.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data; })
      .addCase(fetchSubjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createSubject.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      });
  },
});

export default subjectSlice.reducer;
