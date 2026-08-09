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
   className="border border-gray-300 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative">
      <div className="relative">
      <img 
      src={thumbnail} 
      alt={title} 
      className="w-full h-48 object-cover"/>

        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {duration}
        </span>
        </div>

     <div className="flex items-start gap-3 p-4">
     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 font-semibold">R</div>

    <div className="flex flex-col">
    <h3 className="font-semibold text-base">
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