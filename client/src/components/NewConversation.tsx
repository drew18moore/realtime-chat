import { useState } from "react";
import Search from "./Search";
import useDebounce from "../hooks/useDebounce";
import useSearch from "../hooks/useSearch";
import Contact from "./Contact";
import { useAuth } from "../contexts/AuthContext";

const NewConversation = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const { data: searchResults } = useSearch(debouncedSearch);
  const { currentUser } = useAuth();

  const clearSearch = () => setSearch("");

  return (
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
              />
            );
          })
        ) : (
          <h2 className="text-center">No results found</h2>
        )}
      </div>
    </div>
  );
};

export default NewConversation;
