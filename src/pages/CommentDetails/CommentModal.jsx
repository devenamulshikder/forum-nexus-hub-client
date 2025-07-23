const CommentModal = ({ comment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[80vh]">
        <h3 className="text-lg font-bold mb-4">Full Comment</h3>
        <p className="text-gray-700 break-words whitespace-pre-wrap">
          {comment.comment}
        </p>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default CommentModal;
