import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import VideoDetails from "../pages/VideoDetails";
import Login from "../pages/login";
import UploadVideo from "../pages/UploadVideo";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/videos/:videoId" element={<VideoDetails/>} />
          <Route path="/upload" element={<UploadVideo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;