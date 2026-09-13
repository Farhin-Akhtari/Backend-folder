import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVideoById, updateVideo } from "../services/videoService";

function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);

        const video = response.data;

        setTitle(video.title);
        setDescription(video.description);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await updateVideo(videoId, formData);

      navigate("/my-videos");
    } catch (err) {
      console.error(err);
      setError("Failed to update video");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading...
      </h2>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Video
      </h1>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
            New Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3"
          />
        </div>

        {/* Update */}
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Video"}
        </button>

      </form>
    </div>
  );
}

export default EditVideo;