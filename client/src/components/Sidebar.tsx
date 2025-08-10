import Converasation from "./Converasation";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiSettings5Fill } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useGetConversations } from "../hooks/useConversations";
import ConverasationSkeleton from "./ConversationSkeleton";
import { useSocket } from "../contexts/SocketContext";
import NewConversation from "./NewConversation";
import { BiArrowBack } from "react-icons/bi";

const Sidebar = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isRootRoute = location.pathname === "/";
  const isNewRoute = location.pathname === "/new";

  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversations();
  const { currentUser } = useAuth();
  const { onlineUserIds } = useSocket();

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
        isRootRoute || isNewRoute ? "block" : "hidden"
      } sm:w-96 sm:block relative border-0 sm:border-r-[1px] sm:border-r-neutral-200 dark:sm:border-r-neutral-800`}
    >
      <div className="px-5 py-2 flex items-center justify-between">
        {isNewRoute ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              name="back"
              className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 sm:hidden dark:text-white dark:hover:bg-neutral-800"
              aria-label="Back"
            >
              <BiArrowBack size={"1.5rem"} />
            </button>
            <h1 className="text-xl font-bold dark:text-white">New message</h1>
          </div>
        ) : (
          <>
            <h1 className="text-xl px-4 font-bold dark:text-white">Messages</h1>
            <button
              onClick={() => navigate("/new")}
              name="new-conversation"
              className="cursor-pointer hover:bg-neutral-300 p-[0.625rem] rounded-full bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
              aria-label="New conversation"
            >
              <FiEdit size={"1.25rem"} />
            </button>
          </>
        )}
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2 flex flex-col justify-between">
        {isNewRoute ? (
          <NewConversation />
        ) : (
          <>
            <div className="grid gap-2 overflow-y-auto">
              {conversationsContent?.length === 0 ? (
                <p className="px-5 text-center text-neutral-600 dark:text-neutral-500 absolute top-1/2 -translate-y-1/2 justify-self-center">
                  Click the compose button to start a new conversation.
                </p>
              ) : (
                conversationsContent
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
                onClick={() => navigate("/settings")}
                name="settings"
                className="cursor-pointer hover:bg-neutral-300 p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
                aria-label="Settings"
              >
                <RiSettings5Fill size={"1.5rem"} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
