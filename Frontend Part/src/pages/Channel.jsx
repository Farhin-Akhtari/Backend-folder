import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../services/authService";
import { toggleSubscription } from "../services/subscriptionService";
import { useNavigate } from "react-router-dom";

function Channel() {
  const { username } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


const handleSubscribe = async () => {
  try {
    const response = await toggleSubscription(channel._id);

    const isNowSubscribed = response.data.subscribed;

    setSubscribed(isNowSubscribed);

    setSubscribersCount((prev) =>
      isNowSubscribed ? prev + 1 : prev - 1
    );
  } catch (err) {
    console.error("Subscription failed:", err);
  }
};

  useEffect(() => {
  const fetchChannel = async () => {
    try {
      const response = await getUserChannelProfile(username);

      console.log("Channel:", response);
      console.log(response.data);

      setChannel(response.data);

      setSubscribed(response.data.isSubscribed || false);

      setSubscribersCount(
        response.data.subscribersCount || 0
      );
      
      setSubscriptionsCount(
       response.data.subscriptionsCount || 0
      );

    } catch (err) {
      console.error(err);
      setError("Failed to fetch channel");
    } finally {
      setLoading(false);
    }
  };

  fetchChannel();
}, [username]);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10">
        Loading channel...
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
  <div className="max-w-6xl mx-auto">

    {/* Cover Image */}
    <div className="h-48 md:h-64 w-full overflow-hidden rounded-b-xl">
      {channel.coverImage?.url ? (
        <img
          src={channel.coverImage.url}
          alt="Channel cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
    </div>

    {/* Channel Info */}
    <div className="px-6">

      <div className="flex items-center gap-5 mt-6">

        {/* Avatar */}
        {channel.avatar?.url ? (
          <img
            src={channel.avatar.url}
            alt={channel.username}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
            {channel.username?.[0]?.toUpperCase()}
          </div>
        )}

        {/* Name */}
        <div>
          <h1 className="text-2xl font-bold">
            {channel.fullName}
          </h1>

          <p className="text-gray-600">
            @{channel.username}
          </p>

          <div className="flex gap-5 mt-2 text-sm text-gray-600">
            <button
              onClick={() =>
               navigate(`/channel/${channel._id}/subscribers`)
              }
              className="hover:underline"
            >
             {subscribersCount} subscribers
            </button>

           <button
            onClick={() =>
              navigate(`/channel/${channel._id}/subscriptions`)
            }
            className="hover:underline"
          >
           {subscriptionsCount} subscriptions
          </button>
          </div>
        </div>

      </div>

      {/* Subscribe Button */}
      <div className="mt-5">

        <button
         onClick={handleSubscribe}
          className={`px-6 py-2 rounded-full font-semibold ${
            subscribed
              ? "bg-gray-200 text-black"
              : "bg-black text-white"
          }`}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>

      </div>

    </div>

  </div>
);
}

export default Channel;