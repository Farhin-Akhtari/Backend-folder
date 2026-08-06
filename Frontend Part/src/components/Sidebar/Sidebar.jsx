import { useState } from "react";
import { MdHome, MdSubscriptions, MdHistory, MdWatchLater } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { AiFillLike } from "react-icons/ai";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Home");

  const menuItems = [
    { name: "Home", icon: <MdHome /> },
    { name: "Shorts", icon: <SiYoutubeshorts /> },
    { name: "Subscriptions", icon: <MdSubscriptions /> },
    { name: "History", icon: <MdHistory /> },
    { name: "Watch Later", icon: <MdWatchLater /> },
    { name: "Liked Videos", icon: <AiFillLike /> },
  ];

  return (
   <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => setActiveMenu(item.name)}
            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeMenu === item.name
                ? "bg-gray-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
