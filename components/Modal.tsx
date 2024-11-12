import React from "react";
import Icon from "./icons/Icon";

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isVisible, onClose, title, children }: ModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Icon name="close" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
