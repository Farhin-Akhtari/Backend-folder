import { useNavigate } from "react-router-dom";


function VideoCard({
  videoId,
  title,
  channel,
  views,
  thumbnail,
  duration,
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

     <div className="flex items-start gap-3 p-4">
     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 font-semibold">
        R
      </div>

    <div className="flex flex-col">
    <h3 className="font-semibold text-base line-clamp-2">
        {title}
    </h3>

    <p className="text-sm text-gray-600">
        {channel} • {views} views
    </p>

  </div>
  </div>
    
    </div>
  );
}

export default VideoCard;