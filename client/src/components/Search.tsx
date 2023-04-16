import { useRef } from "react";
import { FiSearch } from "react-icons/fi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

type SearchProps = {
  setSearchResults: React.Dispatch<React.SetStateAction<SearchResults | undefined>>;
};

const Search: React.FC<SearchProps> = ({ setSearchResults }) => {
  const axiosPrivate = useAxiosPrivate();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = async () => {
    if (inputRef.current?.value.trim() === "") {
      setSearchResults(undefined)
      return
    }
    const res = await axiosPrivate.get("/api/users", {
      params: {
        search: inputRef.current?.value.trim(),
      },
    });
    console.log(res.data);
    setSearchResults(res.data);
  };
  return (
    <div className="flex items-center gap-5 w-full mx-5 relative">
      <div className="absolute h-4 pl-3 pointer-events-none text-neutral-600">
        <FiSearch />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="h-fit m-auto px-3 py-1 rounded-full bg-neutral-300 placeholder:text-neutral-600 w-full pl-9"
        placeholder="Search"
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
