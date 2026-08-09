function CommentItem({
  comment,
  loggedInUser,
  video,
  onLike,
  onEdit,
  onDelete,
  editingCommentId,
  editingText,
  setEditingText,
  onSaveEdit,
  onCancelEdit,
}) {
  const isCommentOwner =
    comment.owner?._id === loggedInUser?._id;

  const isVideoOwner =
    video?.owner?._id === loggedInUser?._id;

  const isEditing = editingCommentId === comment._id;

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
        F
      </div>

      <div className="flex-1">
        {/* Username */}
        <p className="font-semibold">
          {comment.owner?.username}
        </p>

        {/* EDIT MODE */}
        {isEditing ? (
          <div className="mt-2">
            <input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onSaveEdit(comment._id)}
                className="text-sm bg-black text-white px-3 py-1 rounded-full"
              >
                Save
              </button>

              <button
                onClick={onCancelEdit}
                className="text-sm bg-gray-200 px-3 py-1 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Normal comment */}
            <p className="text-gray-700">
              {comment.content}
            </p>

            {/* Like */}
            <button
              onClick={() => onLike(comment._id)}
              className={`text-sm mt-1 ${
                comment.isLiked
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {comment.isLiked ? "❤️" : "♡"}{" "}
              {comment.likesCount}
            </button>

            {/* Edit / Delete */}
            <div className="flex gap-3 mt-2">
              {isCommentOwner && (
                <button
                  onClick={() => onEdit(comment)}
                  className="text-sm text-blue-500"
                >
                  Edit
                </button>
              )}

              {(isCommentOwner || isVideoOwner) && (
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CommentItem;