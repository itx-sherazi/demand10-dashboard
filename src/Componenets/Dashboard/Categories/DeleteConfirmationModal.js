"use client";

const DeleteConfirmationModal = ({
  isOpen,
  setIsOpen,
  selectedItem,
  confirmDeletion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirm Deletion
          </h2>
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-500">
              {selectedItem?.name}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            onClick={confirmDeletion}
          >
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;