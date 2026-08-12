import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChannelSubscriptions } from "../services/subscriptionService";

function ChannelSubscriptions() {
  const { channelId } = useParams();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getChannelSubscriptions(channelId);

        console.log("Subscriptions:", response);

        setSubscriptions(response.data.subscribedChannels);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [channelId]);

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading subscriptions...
      </p>
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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Subscriptions
      </h1>

      {subscriptions.length === 0 ? (
        <p>No subscriptions yet.</p>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              {item.channel?.avatar?.url ? (
                <img
                  src={item.channel.avatar.url}
                  alt={item.channel.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                  {item.channel?.username?.[0]?.toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-semibold">
                  {item.channel?.fullName}
                </p>

                <p className="text-sm text-gray-500">
                  @{item.channel?.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChannelSubscriptions;