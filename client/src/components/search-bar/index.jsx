import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch(query);
  };

  return (
    <div>
      <form className="flex items-center gap-4" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={query.trim()}
          className="px-3 py-[6px] rounded-md border outline-none"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={!query.trim()}
          className="px-4 py-[6px] bg-blue-900 text-white font-normal rounded-md transition-all ease-in hover:bg-blue-700 disabled:cursor-not-allowed cursor-pointer"
        >
          search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
