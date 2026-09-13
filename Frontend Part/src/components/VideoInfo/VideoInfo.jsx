function VideoInfo({ video }) {
  return (
    <div className="mt-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {video?.title}
      </h1>

      {/* Views and Date */}
      <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
        <span>{video?.views} views</span>

        <span>•</span>

        <span>
          {video?.createdAt
            ? new Date(video.createdAt).toLocaleDateString()
            : ""}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {video?.description}
      </p>
    </div>
  );
}

export default VideoInfo;