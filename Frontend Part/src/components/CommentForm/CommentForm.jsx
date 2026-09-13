function CommentForm({
  commentText,
  setCommentText,
  onComment,
}) {
  return (
    <div className="flex gap-3 mb-6">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full px-4 py-2"
      />

      <button
        onClick={onComment}
        className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold"
      >
        Comment
      </button>
    </div>
  );
}

export default CommentForm;