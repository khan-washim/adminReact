import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const toastSlice = createSlice({
  name: 'toast',
  initialState: { toasts: [] },
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: nextId++,
        type: 'info',
        title: '',
        message: '',
        duration: 3500,
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;

// Thunk helper
export const showToast = (payload) => (dispatch) => {
  const id = nextId;
  dispatch(addToast(payload));
  setTimeout(() => dispatch(removeToast(id)), payload.duration || 3500);
};
