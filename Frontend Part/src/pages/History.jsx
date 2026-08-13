import { useEffect, useState } from "react";
import { getWatchHistory } from "../services/authService";
import VideoCard from "../components/VideoCard/VideoCard";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getWatchHistory();

        console.log("Watch History:", response);

        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to fetch watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10">
        Loading history...
      </h2>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        History
      </h1>

      {history.length === 0 ? (
        <p className="text-gray-500">
          You haven't watched any videos yet.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {history.map((video) => (
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
      )}
    </div>
  );
}

export default History;