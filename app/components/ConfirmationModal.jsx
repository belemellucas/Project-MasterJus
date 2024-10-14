function ConfirmationModal({ message, isOpen, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg max-w-xs w-full text-center">
          <p className="text-sm mb-4">{message}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            OK
          </button>
        </div>
      </div>
    );
  }
  
export default ConfirmationModal