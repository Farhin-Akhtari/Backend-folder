import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVideos, deleteVideo } from "../services/videoService";
import VideoCard from "../components/VideoCard/VideoCard";

function MyVideos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async (videoId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this video?"
  );

  if (!confirmDelete) return;

  try {
    await deleteVideo(videoId);

    setVideos((prevVideos) =>
      prevVideos.filter((video) => video._id !== videoId)
    );

  } catch (err) {
    console.error("Failed to delete video:", err);
    setError("Failed to delete video");
  }
};

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const response = await getAllVideos("", user?._id);

        setVideos(response);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your videos");
      } finally {
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, [user?._id]);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10">
        Loading your videos...
      </h2>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Videos
      </h1>

      {videos.length === 0 ? (
        <p>You haven't uploaded any videos yet.</p>
      ) : (
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {videos.map((video) => (
  <div key={video._id}>

    <VideoCard
      videoId={video._id}
      title={video.title}
      channel={video.owner?.username}
      views={video.views}
      thumbnail={video.thumbnail?.url}
      duration={video.duration}
    />

    <div className="flex gap-3 px-4 mt-2">

      <button
        onClick={() => navigate(`/edit-video/${video._id}`)}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(video._id)}
        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-700"
      >
        Delete
      </button>

    </div>

  </div>
))}
        </div>
      )}
    </div>
  );
}

export default MyVideos;