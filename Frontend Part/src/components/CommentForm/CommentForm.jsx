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
        className="flex-1 border rounded-full px-4 py-2"
      />

      <button
        onClick={onComment}
        className="px-5 py-2 bg-black text-white rounded-full font-semibold"
      >
        Comment
      </button>
    </div>
  );
}

export default CommentForm;