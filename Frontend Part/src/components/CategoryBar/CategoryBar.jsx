const categories = [
  "All",
  "Music",
  "Gaming",
  "React",
  "Programming",
  "Live",
  "AI",
  "News",
];

function CategoryBar({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="sticky top-16 z-20 bg-white py-4 mb-6">
      <div className="flex gap-3 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;