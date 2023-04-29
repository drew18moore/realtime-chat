import { FiSearch } from "react-icons/fi";

type SearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>
};

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  return (
    <div className="flex items-center gap-5 w-full mx-5 relative">
      <div className="absolute h-4 pl-3 pointer-events-none text-neutral-600">
        <FiSearch />
      </div>
      <input
        type="text"
        className="h-fit m-auto px-3 py-1 rounded-full bg-neutral-300 placeholder:text-neutral-600 w-full pl-9"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
