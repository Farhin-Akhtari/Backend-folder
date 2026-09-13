import { MdWatchLater } from "react-icons/md";

function VideoActions({
  liked,
  likesCount,
  onLike,
  watchLater,
  onWatchLater,
}) {
  return (
    <div className="mt-4 flex items-center gap-3">

      {/* Like */}
      <button
        onClick={onLike}
        className={`px-4 py-2 rounded-full font-semibold transition ${
          liked
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        }`}
      >
        {liked ? "❤️ Liked" : "♡ Like"} {likesCount}
      </button>

      {/* Watch Later */}
      <button
        onClick={onWatchLater}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
          watchLater
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        }`}
      >
        <MdWatchLater className="text-xl" />

        {watchLater
          ? "Saved"
          : "Watch Later"}
      </button>

    </div>
  );
}

export default VideoActions;