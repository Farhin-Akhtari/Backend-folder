import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import VideoDetails from "../pages/VideoDetails";
import Login from "../pages/login";
import UploadVideo from "../pages/UploadVideo";
import MyVideos from "../pages/MyVideos";
import EditVideo from "../pages/EditVideo";
import Channel from "../pages/Channel";
import ChannelSubscribers from "../pages/ChannelSubscribers";
import ChannelSubscriptions from "../pages/ChannelSubscriptions";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/videos/:videoId" element={<VideoDetails/>} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/my-videos" element={<MyVideos />} />
          <Route path="/edit-video/:videoId" element={<EditVideo />} />
          <Route path="/channel/:username" element={<Channel />} />
          <Route path="/channel/:channelId/subscribers" element={<ChannelSubscribers />} />
          <Route path="/channel/:channelId/subscriptions" element={<ChannelSubscriptions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;