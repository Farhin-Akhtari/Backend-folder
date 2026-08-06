import { FiSearch } from "react-icons/fi";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30">
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
            className="border border-gray-300 rounded-l-full px-4 py-2 w-full outline-none"
          />

          <button className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-r-full hover:bg-gray-200 transition">
             <FiSearch />
          </button>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
          F
        </div>

      </div>
    </nav>
  );
}

export default Navbar;