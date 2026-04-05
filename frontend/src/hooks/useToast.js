import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice.js';

export const useToast = () => {
  const dispatch = useDispatch();

  const toast = {
    success: (message, title = 'Success') => dispatch(showToast({ type: 'success', title, message })),
    error: (message, title = 'Error') => dispatch(showToast({ type: 'error', title, message })),
    warning: (message, title = 'Warning') => dispatch(showToast({ type: 'warning', title, message })),
    info: (message, title = 'Info') => dispatch(showToast({ type: 'info', title, message })),
  };

  return toast;
};
