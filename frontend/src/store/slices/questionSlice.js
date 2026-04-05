import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios.js';

export const fetchQuestions = createAsyncThunk('questions/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/questions', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createQuestion = createAsyncThunk('questions/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/questions', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateQuestion = createAsyncThunk('questions/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/questions/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteQuestion = createAsyncThunk('questions/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/questions/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const importQuestions = createAsyncThunk('questions/import', async (questions, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/questions/import', { questions });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const questionSlice = createSlice({
  name: 'questions',
  initialState: { items: [], total: 0, page: 1, pages: 1, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => { state.loading = true; })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchQuestions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createQuestion.fulfilled, (state, action) => { state.items.unshift(action.payload); state.total += 1; })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const idx = state.items.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((q) => q._id !== action.payload);
        state.total -= 1;
      });
  },
});

export default questionSlice.reducer;
