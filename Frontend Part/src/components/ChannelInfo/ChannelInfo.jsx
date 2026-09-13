function ChannelInfo({ video, subscribersCount }) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      {video.owner?.avatar?.url ? (
        <img
          src={video.owner.avatar.url}
          alt={video.owner.username}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-900 dark:text-white">
          {video.owner?.username?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Channel Details */}
      <div>
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
          {video?.owner?.username}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subscribersCount} subscribers
        </p>
      </div>
    </div>
  );
}

export default ChannelInfo;