import { useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useGetConversation } from "../hooks/useConversations";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import ConversationInfoDropdown from "./ConversationInfoDropdown";

const ConversationInfo = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { data: conversation } = useGetConversation(parseInt(conversationId!));
  const { currentUser } = useAuth();
  const recipients = conversation?.participants.filter(
    (participant) => participant.id !== currentUser?.id
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log(conversation?.isGroup);
  }, [conversation, recipients]);
  return (
    <div className="flex flex-col h-[calc(100svh)] min-w-0">
      <div className="flex-none flex items-center justify-between py-2 px-5 sm:px-10 border-b border-b-neutral-200 dark:border-b-neutral-800 min-w-0">
        <div className="flex items-center gap-3">
          <button
            className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 dark:text-white dark:hover:bg-neutral-800"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <BiArrowBack size={"100%"} />
          </button>
          <h1 className="text-2xl dark:text-white">Conversation details</h1>
        </div>
        <div className="flex items-center gap-3 relative">
          <button
            className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 dark:text-white dark:hover:bg-neutral-800"
            onClick={() => setShowDropdown((prev) => !prev)}
            ref={toggleBtnRef}
          >
            <FiMoreHorizontal size={"100%"} />
          </button>
          {showDropdown && (
            <ConversationInfoDropdown
              setShowDropdown={setShowDropdown}
              toggleBtnRef={toggleBtnRef}
              isGroup={conversation?.isGroup || false}
              isOwner={conversation?.ownerId === currentUser?.id}
            />
          )}
        </div>
      </div>
      <div className="p-5 text-neutral-700 dark:text-neutral-300 flex flex-col items-center">
        {conversation?.isGroup && conversation?.group_picture?.length ? (
          <img
            src={conversation?.group_picture}
            alt="group picture"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <span className="flex items-center justify-center w-32 aspect-square rounded-full overflow-hidden">
              <img
                src={recipients?.[0].profile_picture || "default-pfp.jpg"}
                alt="profile picture"
                className="w-full h-full object-cover"
              />
            </span>
            {conversation?.isGroup ? (
              <h2 className="text-2xl dark:text-white">
                {conversation?.title || "Add a title"}
              </h2>
            ) : (
              <h2 className="text-2xl dark:text-white">
                {recipients?.[0].display_name}
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationInfo;
