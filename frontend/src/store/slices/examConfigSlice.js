import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

export const fetchExamConfigs = createAsyncThunk('examConfigs/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/exam-configs');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createExamConfig = createAsyncThunk('examConfigs/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/exam-configs', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateExamConfig = createAsyncThunk('examConfigs/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/exam-configs/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteExamConfig = createAsyncThunk('examConfigs/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/exam-configs/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const examConfigSlice = createSlice({
  name: 'examConfigs',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamConfigs.pending, (state) => { state.loading = true; })
      .addCase(fetchExamConfigs.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data; })
      .addCase(fetchExamConfigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createExamConfig.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateExamConfig.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteExamConfig.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default examConfigSlice.reducer;
