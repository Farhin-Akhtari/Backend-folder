function ChannelInfo({ video, subscribersCount }) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
        R
      </div>

      {/* Channel Details */}
      <div>
        <h2 className="font-semibold text-lg">
          {video?.owner?.username}
        </h2>

        <p className="text-sm text-gray-500">
          {subscribersCount} subscribers
        </p>
      </div>
    </div>
  );
}

export default ChannelInfo;