function VideoActions({
  liked,
  likesCount,
  onLike,
}) {
  return (
    <div className="mt-4">
      <button
        onClick={onLike}
        className={`px-4 py-2 rounded-full font-semibold transition ${
          liked
            ? "bg-black text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {liked ? "❤️ Liked" : "♡ Like"} {likesCount}
      </button>
    </div>
  );
}

export default VideoActions;