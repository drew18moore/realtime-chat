import { FiSearch } from "react-icons/fi";
import { RiCloseFill } from "react-icons/ri";
import Input from "./ui/Input";

type SearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  return (
    <div className="flex items-center gap-5 w-full mx-5 relative">
      <div className="absolute h-4 pl-3 pointer-events-none text-neutral-600 dark:text-neutral-500">
        <FiSearch />
      </div>
      <Input
        size="sm"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
      {search && (
        <div
          className="absolute right-3 cursor-pointer dark:text-white"
          onClick={() => setSearch("")}
        >
          <RiCloseFill />
        </div>
      )}
    </div>
  );
};

export default Search;
