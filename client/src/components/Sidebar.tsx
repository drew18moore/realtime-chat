import { useState } from "react";
import Converasation from "./Converasation";
import Search from "./Search";
import { useAuth } from "../contexts/AuthContext";
import Contact from "./Contact";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { RiSettings5Fill } from "react-icons/ri";
import useLogout from "../hooks/auth/useLogout";
import { useGetConversations } from "../hooks/useConversations";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import ConverasationSkeleton from "./ConversationSkeleton";
import useDebounce from "../hooks/useDebounce";
import { useSocket } from "../contexts/SocketContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootRoute = location.pathname === "/";
  const axiosPrivate = useAxiosPrivate();
  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversations();
  const { mutate: logout } = useLogout();
  const { conversationId } = useParams();
  const { currentUser } = useAuth();
  const { onlineUserIds } = useSocket();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  const clearSearch = () => {
    setSearch("");
  };

  const { data: searchResults } = useQuery<AxiosResponse<SearchResults>>(
    ["searchUsers", debouncedSearch.trim()],
    () => {
      return axiosPrivate.get("/api/users", {
        params: { search: debouncedSearch.trim() },
      });
    },
    { enabled: debouncedSearch.trim() !== "" }
  );

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
          lastMessage={conversation.lastMessageSent?.message}
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
          {!searchResults?.data ? (
            conversationsContent
          ) : searchResults.data.users.length > 0 ? (
            searchResults.data.users.map((result) => {
              return (
                <Contact
                  img={result.profile_picture || "default-pfp.jpg"}
                  id={result.id}
                  displayName={result.display_name}
                  username={result.username}
                  key={result.id}
                  clearSearch={clearSearch}
                />
              );
            })
          ) : (
            <h2 className="text-center">No results found</h2>
          )}
        </div>
        <div className="flex items-center justify-between">
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
          <button
            onClick={() => logout()}
            className="hover:bg-neutral-300 h-fit p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
