import React from 'react';
import styles from '../components/Modal.module.css'; // Define styles for modal

type ModalProps = {
    onClose: () => void;
    children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
