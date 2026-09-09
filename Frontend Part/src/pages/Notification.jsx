import { useContext } from "react";
import {useNavigate} from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext.jsx";

const getTimeAgo = (date) => {
  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return new Date(date).toLocaleDateString();
};

function Notifications() {
  const { notifications, markAsRead } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
  await markAsRead(notification._id);

  if (
    notification.type === "comment" ||
    notification.type === "like"
  ) {
    if (notification.video?._id) {
      navigate(`/videos/${notification.video._id}`);
    }
  }

  if (notification.type === "subscribe") {
    if (notification.sender?.username) {
      navigate(`/channel/${notification.sender.username}`);
    }
  }
};

  return (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">
      Notifications
    </h1>

    {notifications.length === 0 ? (
      <p className="text-gray-500 text-center py-10">
        No notifications
      </p>
    ) : (
      <div className="bg-white rounded-xl shadow-sm border">
        {notifications.map((notification) => (
         <div
           key={notification._id}
           onClick={() => handleNotificationClick(notification)}
           className={`flex gap-4 p-4 border-b last:border-b-0 cursor-pointer
            transition-all duration-200
            hover:bg-gray-200 hover:scale-[1.01]${
           !notification.isRead ? "bg-blue-100" : "bg-white"
            } cursor-pointer hover:bg-gray-100`}
        >
            {/* Sender Avatar */}
            <img
              src={notification.sender?.avatar}
              alt={notification.sender?.username}
              className="w-12 h-12 rounded-full object-cover"
            />

            {/* Notification Content */}
            <div className="flex-1">
              
              {/* Comment */}
              {notification.type === "comment" && (
                <>
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {notification.sender?.username}
                    </span>{" "}
                    commented on your video{" "}
                    <span className="font-semibold">
                      "{notification.video?.title}"
                    </span>
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    "{notification.comment?.content}"
                  </p>
                </>
              )}

              {/* Like */}
              {notification.type === "like" && (
                <p className="text-gray-700">
                  <span className="font-semibold">
                    {notification.sender?.username}
                  </span>{" "}
                  liked your video{" "}
                  <span className="font-semibold">
                    "{notification.video?.title}"
                  </span>
                </p>
              )}

              {/* Subscribe */}
              {notification.type === "subscribe" && (
                <p className="text-gray-700">
                  <span className="font-semibold">
                    {notification.sender?.username}
                  </span>{" "}
                  subscribed to your channel.
                </p>
              )}

              {/* New */}
              {!notification.isRead && (
                <p className="text-xs text-blue-500 mt-2">
                  New
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Notifications;