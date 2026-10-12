import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-white rounded-xl shadow-2xl border border-gray-100 w-full ${maxWidth} overflow-hidden transform transition-all`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-silver">
          <h3 className="text-lg font-semibold text-brand-black">{title}</h3>
          <button
            onClick={onClose}
            className="text-brand-grey hover:text-brand-black p-1.5 rounded-lg hover:bg-gray-200/60 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
