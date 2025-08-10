import { useState } from "react";
import Converasation from "./Converasation";
import Search from "./Search";
import { useAuth } from "../contexts/AuthContext";
import Contact from "./Contact";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiSettings5Fill } from "react-icons/ri";
import { useGetConversations } from "../hooks/useConversations";
import ConverasationSkeleton from "./ConversationSkeleton";
import useDebounce from "../hooks/useDebounce";
import { useSocket } from "../contexts/SocketContext";
import useSearch from "../hooks/useSearch";

const Sidebar = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isRootRoute = location.pathname === "/";

  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversations();
  const { currentUser } = useAuth();
  const { onlineUserIds } = useSocket();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const { data: searchResults } = useSearch(debouncedSearch);

  const clearSearch = () => {
    setSearch("");
  };

  let conversationsContent: JSX.Element[] | undefined = [];

  if (isLoadingConversations) {
    const numSkeletonComponents = 6;
    for (let i = 0; i < numSkeletonComponents; i++) {
      conversationsContent?.push(<ConverasationSkeleton key={i} />);
    }
  } else {
    conversationsContent = conversations?.map((conversation) => {
      const conversationWithSelf =
        conversation.participants.length === 1 &&
        conversation.participants[0].id === currentUser?.id;
      const recipients = conversation.participants.filter(
        (participant) => participant.id !== currentUser?.id
      );
      return (
        <Converasation
          lastMessageSent={conversation.lastMessageSent}
          dateLastMessage={
            conversation.lastMessageSent?.created_at
              ? new Date(conversation.lastMessageSent?.created_at)
              : undefined
          }
          isSelected={conversation.id.toString() === conversationId}
          conversationId={conversation.id}
          recipient={
            conversationWithSelf ? conversation.participants[0] : recipients[0]
          }
          key={conversation.id}
          isOnline={
            conversationWithSelf
              ? onlineUserIds.includes(conversation.participants[0].id)
              : onlineUserIds.includes(recipients[0].id)
          }
          isRead={conversation.isRead}
          conversationWithSelf={conversationWithSelf}
        />
      );
    });
  }

  return (
    <div
      className={`h-[calc(100svh)] w-full ${
        isRootRoute ? "block" : "hidden"
      } sm:w-96 sm:block relative border-0 sm:border-r-[1px] sm:border-r-neutral-200 dark:sm:border-r-neutral-800`}
    >
      <div className="px-5 py-2 flex items-center justify-between">
        <h1 className="text-xl px-4 font-bold dark:text-white">Messages</h1>
        <button
          onClick={() => navigate("/settings")}
          name="settings"
          className="cursor-pointer hover:bg-neutral-300 p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
        >
          <RiSettings5Fill size={"1.5rem"} />
        </button>
      </div>
      <div className="flex absolute top-14 left-0 right-0 h-14 justify-center">
        <Search search={search} setSearch={setSearch} />
      </div>
      <div className="absolute top-28 left-0 right-0 bottom-0 p-2 flex flex-col justify-between">
        <div className="grid gap-2 overflow-y-auto">
          {!searchResults ? (
            conversationsContent?.length === 0 ? (
              <p className="px-5 text-center text-neutral-600 dark:text-neutral-500 absolute top-1/2 -translate-y-1/2 justify-self-center">
                Use the search bar above to find users to message.
              </p>
            ) : (
              conversationsContent
            )
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
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-2">
            <div className="w-12 aspect-square rounded-full overflow-hidden">
              <img
                src={currentUser?.profile_picture || "default-pfp.jpg"}
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid items-center">
              <p className="text-base leading-4 dark:text-white">
                {currentUser?.display_name}
              </p>
              <p className="text-neutral-600 text-sm leading-4 dark:text-neutral-500">
                @{currentUser?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
