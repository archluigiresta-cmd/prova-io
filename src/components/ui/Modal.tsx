import React from 'react';
import { X } from 'lucide-react';

// FIX: Add explicit types for component props.
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <h2 className="text-xl font-bold text-dark mb-4">{title}</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;