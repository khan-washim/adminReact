import React, { useEffect } from 'react';
import { BsX } from 'react-icons/bs';

function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = { sm: '420px', md: '560px', lg: '720px', xl: '900px' };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: maxWidths[size] || maxWidths.md }}>
        <div className="modal-header-custom">
          <h5>{title}</h5>
          <button className="modal-close" onClick={onClose}><BsX /></button>
        </div>
        <div className="modal-body-custom">{children}</div>
        {footer && <div className="modal-footer-custom">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
