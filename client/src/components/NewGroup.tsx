import React, { useMemo, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useDebounce from "../hooks/useDebounce";
import useSearch from "../hooks/useSearch";
import Contact from "./Contact";
import Search from "./Search";

const NewGroup: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const { data: searchResults } = useSearch(debouncedSearch);
  const { currentUser } = useAuth();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const clearSearch = () => setSearch("");

  const toggleSelect = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectedCount = selectedUserIds.length;
  const canCreateGroup = useMemo(() => selectedCount >= 2, [selectedCount]);
  return (
    <>
      <div className="px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            name="back"
            className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 dark:text-white dark:hover:bg-neutral-800"
            aria-label="Back"
          >
            <BiArrowBack size={"1.5rem"} />
          </button>
          <h1 className="text-xl font-bold dark:text-white">New Group</h1>
        </div>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2 flex flex-col justify-between">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex h-14 justify-center">
            <Search search={search} setSearch={setSearch} />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
            {!searchResults ? (
              <p className="px-5 text-center text-neutral-600 dark:text-neutral-500 mt-10">
                Search for users to start a conversation.
              </p>
            ) : searchResults.users.length > 0 ? (
              searchResults.users.map((result) => {
                const isCurrentUser = result.id === currentUser?.id;
                return (
                  <Contact
                    img={result.profile_picture || "default-pfp.jpg"}
                    id={result.id}
                    displayName={result.display_name}
                    username={result.username}
                    key={result.id}
                    clearSearch={clearSearch}
                    isCurrentUser={isCurrentUser}
                    toggleable
                    selected={selectedUserIds.includes(result.id)}
                    onToggle={toggleSelect}
                  />
                );
              })
            ) : (
              <h2 className="text-center">No results found</h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewGroup;
