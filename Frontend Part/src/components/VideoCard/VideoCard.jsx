import { useNavigate } from "react-router-dom";

function VideoCard({
  videoId,
  title,
  channel,
  views,
  thumbnail,
  duration,
  ownerAvatar,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/videos/${videoId}`)}
      className="cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />

        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </span>
      </div>

      {/* Video Information */}
      <div className="flex items-start gap-3 p-4">

        {/* Avatar */}
       {ownerAvatar ? (
        <img
           src={ownerAvatar}
           alt={channel}
           className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 font-semibold">
       {channel?.[0]?.toUpperCase()}
     </div>
)}

        {/* Details */}
        <div className="flex flex-1 min-w-0">

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2">
              {title}
            </h3>

            <p className="text-sm text-gray-600">
              {channel} • {views} views
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VideoCard;