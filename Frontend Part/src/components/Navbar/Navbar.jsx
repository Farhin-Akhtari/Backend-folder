import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { logoutUser } from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [search, setSearch] = useState("");

  const [showMenu, setShowMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleSearch = () => {
  if (!search.trim()) return;

  navigate(`/?search=${encodeURIComponent(search.trim())}`);
 };

 const handleLogout = async () => {
  try {
    await logoutUser();

    localStorage.removeItem("user");

    setUser(null);
    setShowMenu(false);

    navigate("/login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-3 border-b bg-white">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-red-600 cursor-pointer">
          PlayNest
        </h1>

        {/* Search */}
        <div className="flex items-center w-[450px]">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
             if (e.key === "Enter") {
               handleSearch();
              }
            }}
            className="border border-gray-300 rounded-l-full px-4 py-2 w-full outline-none"
          />

         <button
            onClick={handleSearch}
            className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-r-full hover:bg-gray-200 transition"
          >
           <FiSearch />
          </button>
        </div>

        {/* User */}
        <div className="relative">

          {user ? (
            <>
              {/* Avatar */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold overflow-hidden"
              >
                {user.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )}
              </button>

              {/* Logout menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg p-2 z-50">

                  <p className="px-3 py-2 text-sm font-semibold">
                    {user.username}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>

                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-black text-white rounded-full"
            >
              Login
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;