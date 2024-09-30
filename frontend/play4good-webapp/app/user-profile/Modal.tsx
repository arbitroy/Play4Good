import React from 'react';

type ModalProps = {
    onClose: () => void;
    children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#635C51] p-5 rounded-lg w-[400px] relative">
                <button 
                    className="absolute top-2 right-2 bg-transparent border-none text-2xl cursor-pointer"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;