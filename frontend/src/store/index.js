import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './slices/toastSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';
import questionReducer from './slices/questionSlice.js';
import userReducer from './slices/userSlice.js';
import subjectReducer from './slices/subjectSlice.js';
import examConfigReducer from './slices/examConfigSlice.js';
import examTypeReducer from './slices/examTypeSlice.js';
import uiReducer from './slices/uiSlice.js';
import authReducer from './slices/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    dashboard: dashboardReducer,
    questions: questionReducer,
    users: userReducer,
    subjects: subjectReducer,
    examConfigs: examConfigReducer,
    examTypes: examTypeReducer,
    ui: uiReducer,
  },
});
