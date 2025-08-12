import { FiEdit } from "react-icons/fi";
import { RiSettings5Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGetConversations } from "../hooks/useConversations";
import { useSocket } from "../contexts/SocketContext";
import Converasation from "./Converasation";
import ConversationSkeleton from "./ConversationSkeleton";

const Inbox = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversations();
  const { currentUser } = useAuth();
  const { onlineUserIds } = useSocket();

  let conversationsContent: JSX.Element[] | undefined = [];

  if (isLoadingConversations) {
    const numSkeletonComponents = 6;
    for (let i = 0; i < numSkeletonComponents; i++) {
      conversationsContent?.push(<ConversationSkeleton key={i} />);
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
          participants={conversation.participants}
          key={conversation.id}
          isOnline={
            conversationWithSelf
              ? onlineUserIds.includes(conversation.participants[0].id)
              : onlineUserIds.includes(recipients[0].id)
          }
          isRead={conversation.isRead}
          conversationWithSelf={conversationWithSelf}
          isGroup={conversation.isGroup}
          groupPicture={conversation.group_picture}
        />
      );
    });
  }

  return (
    <>
      <div className="px-5 py-2 flex items-center justify-between">
        <h1 className="text-xl px-4 font-bold dark:text-white">Messages</h1>
        <button
          onClick={() => navigate("/new")}
          name="new-conversation"
          className="cursor-pointer hover:bg-neutral-300 p-[0.625rem] rounded-full bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
          aria-label="New conversation"
        >
          <FiEdit size={"1.25rem"} />
        </button>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2 flex flex-col justify-between">
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
      </div>
    </>
  );
};

export default Inbox;
