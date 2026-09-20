import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="search-bar">

      <Search size={20} />

      <input
        type="text"
        placeholder="Search for spaces, locations or amenities..."
      />

      <button>
        <Search size={20} />
      </button>

    </div>
  );
}