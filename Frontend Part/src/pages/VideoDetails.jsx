import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../services/videoService";
import { toggleSubscription } from "../services/subscriptionService";
import { toggleVideoLike, toggleCommentLike } from "../services/likeService";
import { getVideoComments, createComment, updateComment, deleteComment} from "../services/commentService";
import CommentItem from "../components/CommentItem/CommentItem";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import VideoInfo from "../components/VideoInfo/VideoInfo";
import ChannelInfo from "../components/ChannelInfo/ChannelInfo";
import VideoActions from "../components/VideoActions/VideoActions";
import CommentForm from "../components/CommentForm/CommentForm";

function VideoDetails() {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  //for login
const loggedInUser = JSON.parse(localStorage.getItem("user"));

const fetchedVideoId = useRef(null);

  useEffect(() => {
   if (fetchedVideoId.current === videoId) return;

     fetchedVideoId.current = videoId;

   const fetchVideo = async () => {
    try {
      const response = await getVideoById(videoId);

      setVideo(response.data);

      setSubscribed(response.data.owner?.isSubscribed || false);
      setSubscribersCount(
        response.data.owner?.subscribersCount || 0
      );

      setLiked(response.data.isLiked || false);
      setLikesCount(response.data.likesCount || 0);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch video");
    } finally {
      setLoading(false);
    }
  };

  fetchVideo();
}, [videoId]);

//For comments
useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await getVideoComments(videoId);

      setComments(response.data.docs);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  fetchComments();
}, [videoId]);

 // ADD THE SUBSCRIBE BUTTON HANDLER HERE
  const handleSubscribe = async () => {
    try {
      const response = await toggleSubscription(video.owner._id);

      const isNowSubscribed = response.data.subscribed;

      setSubscribed(isNowSubscribed);

      setSubscribersCount((prev) =>
        isNowSubscribed ? prev + 1 : prev - 1
      );

    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  //ADD LIKE BUTTON HANDLER
  const handleLike = async () => {
  try {
    const response = await toggleVideoLike(videoId);

    const isNowLiked = response.data.liked;

    setLiked(isNowLiked);

    setLikesCount((prev) =>
      isNowLiked ? prev + 1 : prev - 1
    );

  } catch (err) {
    console.error("Like failed:", err);
  }
};

//ADD CREATE COMMENT HANDLER
const handleComment = async () => {
  if (!commentText.trim()) return;

  try {
    const response = await createComment(videoId, commentText);

    setComments((prev) => [
      {
      ...response.data,
        likesCount: 0,
        isLiked: false,
      },
      ...prev,
    ]);

    setCommentText("");
  } catch (err) {
    console.error("Failed to create comment:", err);
  }
};

//ADD COMMENT LIKE
const handleCommentLike = async (commentId) => {
  try {
    const response = await toggleCommentLike(commentId);

    const isNowLiked = response.data.liked;

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              isLiked: isNowLiked,
              likesCount: isNowLiked
                ? comment.likesCount + 1
                : comment.likesCount - 1,
            }
          : comment
      )
    );

  } catch (err) {
    console.error("Comment like failed:", err);
  }
};

//ADD EDIT COMMENT HANDLER
const handleEditComment = async (commentId) => {
  if (!editingText.trim()) return;

  try {
    const response = await updateComment(
      commentId,
      editingText
    );

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              content: response.data.content,
            }
          : comment
      )
    );

    setEditingCommentId(null);
    setEditingText("");

  } catch (err) {
    console.error("Failed to update comment:", err);
  }
 };

 //ADD DELETE COMMENT HANDLER
 const handleDeleteComment = async (commentId) => {
  try {
    const response = await deleteComment(commentId);

    setComments((prevComments) =>
      prevComments.filter(
        (comment) => comment._id !== commentId
      )
    );

  } catch (err) {
    console.error("Failed to delete comment:", err);
  }
 };

  if (loading) {
    return <h2 className="text-center text-xl mt-10">Loading...</h2>;
  }

  if (error) {
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">
        {error}
      </h2>
    );
  }


  return (
  <>
    {/* Video Player */}
    <VideoPlayer video={video} />

    {/* Video Information */}
    <VideoInfo video={video} />

    {/* Channel Section */}
    <div className="flex items-center justify-between mt-6">
      {/* Channel Info */}
      <ChannelInfo
        video={video}
        subscribersCount={subscribersCount}
      />

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        className={`px-5 py-2 rounded-full font-semibold transition ${
          subscribed
            ? "bg-gray-200 text-black"
            : "bg-black text-white"
        }`}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>

    {/* Video Actions */}
    <VideoActions
      liked={liked}
      likesCount={likesCount}
      onLike={handleLike}
    />

    {/* Comment Section */}
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        Comments
      </h2>

      {/* Add Comment */}
       <CommentForm
          commentText={commentText}
          setCommentText={setCommentText}
          onComment={handleComment}
        />

      {/* Comments */}
      {commentsLoading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              loggedInUser={loggedInUser}
              video={video}
              onLike={handleCommentLike}

              onEdit={(comment) => {
                setEditingCommentId(comment._id);
                setEditingText(comment.content);
              }}

              onDelete={handleDeleteComment}

              editingCommentId={editingCommentId}
              editingText={editingText}
              setEditingText={setEditingText}

              onSaveEdit={handleEditComment}

              onCancelEdit={() => {
                setEditingCommentId(null);
                setEditingText("");
              }}
            />
          ))}
        </div>
      )}
    </div>
  </>
);
  }

export default VideoDetails;