import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsCheckCircleFill, BsXCircleFill, BsExclamationTriangleFill, BsInfoCircleFill, BsX } from 'react-icons/bs';
import { removeToast } from '../../store/slices/toastSlice.js';

const icons = {
  success: <BsCheckCircleFill />,
  error: <BsXCircleFill />,
  warning: <BsExclamationTriangleFill />,
  info: <BsInfoCircleFill />,
};

function ToastContainer() {
  const dispatch = useDispatch();
  const toasts = useSelector((s) => s.toast.toasts);

  return (
    <div className="toast-container-custom">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.type}`}>
          <span className="toast-icon">{icons[t.type]}</span>
          <div className="toast-text">
            {t.title && <div className="toast-title">{t.title}</div>}
            <div>{t.message}</div>
          </div>
          <button className="toast-close" onClick={() => dispatch(removeToast(t.id))}>
            <BsX />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
