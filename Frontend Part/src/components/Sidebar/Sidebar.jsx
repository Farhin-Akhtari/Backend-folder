import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdHome,
  MdSubscriptions,
  MdHistory,
  MdWatchLater,
  MdVideoLibrary,
} from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { AiFillLike } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Home");

  const user = JSON.parse(localStorage.getItem("user"));

  const mainMenuItems = [
    { name: "Home", icon: <MdHome />, path: "/" },
    { name: "Shorts", icon: <SiYoutubeshorts />, path: "/shorts" },
    {
      name: "Subscriptions",
      icon: <MdSubscriptions />,
      path: "/subscriptions",
    },
  ];

  const yourMenuItems = [
    {
      name: "Your Channel",
      icon: <FaUser />,
      path: user ? `/channel/${user.username}` : "/login",
    },
    {
      name: "My Videos",
      icon: <MdVideoLibrary />,
      path: "/my-videos",
    },
    {
      name: "Upload Video",
      icon: <FiUpload />,
      path: "/upload",
    },
  ];

  const otherMenuItems = [
    { name: "History", icon: <MdHistory />, path: "/history" },
    {
      name: "Watch Later",
      icon: <MdWatchLater />,
      path: "/watch-later",
    },
    {
      name: "Liked Videos",
      icon: <AiFillLike />,
      path: "/liked-videos",
    },
  ];

  const handleNavigation = (item) => {
    setActiveMenu(item.name);
    navigate(item.path);
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <li
        key={item.name}
        onClick={() => handleNavigation(item)}
        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
          activeMenu === item.name
            ? "bg-gray-200 font-semibold"
            : "hover:bg-gray-100"
        }`}
      >
        <span className="text-xl">{item.icon}</span>
        <span>{item.name}</span>
      </li>
    ));
  };

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 overflow-y-auto">
      
      {/* Main Menu */}
      <ul className="space-y-2">
        {renderMenuItems(mainMenuItems)}
      </ul>

      <hr className="my-4 border-gray-200" />

      {/* You */}
      <h2 className="px-3 mb-2 text-sm font-semibold text-gray-500">
        You
      </h2>

      <ul className="space-y-2">
        {renderMenuItems(yourMenuItems)}
      </ul>

      <hr className="my-4 border-gray-200" />

      {/* Other */}
      <ul className="space-y-2">
        {renderMenuItems(otherMenuItems)}
      </ul>

    </aside>
  );
}

export default Sidebar;
