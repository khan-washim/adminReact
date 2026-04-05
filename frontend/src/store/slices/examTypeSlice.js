import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

export const fetchExamTypes = createAsyncThunk('examTypes/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/exam-types');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createExamType = createAsyncThunk('examTypes/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/exam-types', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateExamType = createAsyncThunk('examTypes/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/exam-types/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteExamType = createAsyncThunk('examTypes/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/exam-types/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const examTypeSlice = createSlice({
  name: 'examTypes',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamTypes.pending, (state) => { state.loading = true; })
      .addCase(fetchExamTypes.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data; })
      .addCase(fetchExamTypes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createExamType.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateExamType.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteExamType.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export default examTypeSlice.reducer;
