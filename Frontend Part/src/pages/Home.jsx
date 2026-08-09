import { useState, useEffect } from "react";
import { getAllVideos } from "../services/videoService";
import VideoCard from "../components/VideoCard/VideoCard";
import CategoryBar from "../components/CategoryBar/CategoryBar";

function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(() => {
      const fetchVideos = async () => {
        try {
          const response = await getAllVideos();

           console.log("Videos:", response);

         setVideos(response);
          } catch (err) {
             console.error(err);
             setError("Failed to fetch videos");
            } finally {
             setLoading(false);
        }
      };

       fetchVideos();
    }, []);

       if (loading) {
    return (
      <h2 className="text-center text-xl mt-10">
        Loading...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">
        {error}
      </h2>
    );
  }
  console.log("videos state:", videos);

  return (
   <div>
  
    {/*Category bar */}
      <CategoryBar />

       {/*Video grid*/}
    <div className="grid gap-8 mt-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
       {videos.map((video) => (
        <VideoCard
            key={video._id}
            videoId={video._id}
            title={video.title}
            channel={video.owner?.username}
            views={video.views}
            thumbnail={video.thumbnail?.url}
            duration={video.duration}
        />
     ))}
    </div>
    
    </div>

  );
}

export default Home;