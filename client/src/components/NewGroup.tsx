import React, { useMemo, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { RiCloseFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useDebounce from "../hooks/useDebounce";
import useSearch from "../hooks/useSearch";
import Contact from "./Contact";
import Search from "./Search";
import { useNewConversation } from "../hooks/useConversations";

const NewGroup: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const { data: searchResults } = useSearch(debouncedSearch);
  const { currentUser } = useAuth();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const { mutate: newConversation } = useNewConversation([currentUser!.id, ...selectedUserIds], true);
  const [selectedUsersById, setSelectedUsersById] = useState<
    Record<number, any>
  >({});
  const filteredUsers = useMemo(
    () => (searchResults?.users ?? []).filter((u) => u.id !== currentUser?.id),
    [searchResults, currentUser?.id]
  );

  const clearSearch = () => setSearch("");

  const toggleSelectUser = (user: any) => {
    const userId = user.id as number;
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    setSelectedUsersById((prev) => {
      if (prev[userId]) {
        const { [userId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [userId]: user };
    });
  };

  const removeSelectedUser = (userId: number) => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    setSelectedUsersById((prev) => {
      const { [userId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const clearAllSelected = () => {
    setSelectedUserIds([]);
    setSelectedUsersById({});
  };

  const selectedCount = selectedUserIds.length;
  const canCreateGroup = useMemo(() => selectedCount >= 1, [selectedCount]);
  return (
    <>
      <div className="px-5 py-2 flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
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
          <button
            onClick={() => newConversation()}
            disabled={!canCreateGroup}
            className="text-blue-600 px-4 py-2 rounded-md disabled:opacity-50"
          >
            Create{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>
        </div>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2 flex flex-col justify-between">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex h-14 justify-center">
            <Search search={search} setSearch={setSearch} />
          </div>
          {selectedCount > 0 && (
            <div className="px-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Selected
                </p>
                <button
                  type="button"
                  onClick={clearAllSelected}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pb-1">
                {Object.values(selectedUsersById).map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 dark:text-white flex-shrink-0"
                    title={u.display_name}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-100 text-purple-700 flex items-center justify-center">
                      <img
                        src={u.profile_picture || "default-pfp.jpg"}
                        alt={u.display_name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-sm max-w-[10rem] truncate">
                      {u.display_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSelectedUser(u.id)}
                      className="rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 w-5 h-5 flex items-center justify-center"
                      aria-label={`Remove ${u.display_name}`}
                    >
                      <RiCloseFill size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
            {!searchResults ? (
              <p className="px-5 text-center text-neutral-600 dark:text-neutral-500 mt-10">
                Search for users to start a conversation.
              </p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((result: any) => (
                <Contact
                  img={result.profile_picture || "default-pfp.jpg"}
                  id={result.id}
                  displayName={result.display_name}
                  username={result.username}
                  key={result.id}
                  clearSearch={clearSearch}
                  isCurrentUser={false}
                  toggleable
                  selected={selectedUserIds.includes(result.id)}
                  onToggle={() => toggleSelectUser(result)}
                />
              ))
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
