import { useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useGetConversation } from "../hooks/useConversations";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import ConversationInfoDropdown from "./ConversationInfoDropdown";
import EditConversationModal from "./EditConversationModal";

const ConversationInfo = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { data: conversation } = useGetConversation(parseInt(conversationId!));
  const { currentUser } = useAuth();
  const recipients = conversation?.participants.filter(
    (participant) => participant.id !== currentUser?.id
  );
  const conversationWithSelf = recipients?.length === 0;
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
              onEditClick={() => setShowEditModal(true)}
            />
          )}
        </div>
      </div>
      <div className="p-5 text-neutral-700 dark:text-neutral-300 flex flex-col items-center">
        {conversation?.isGroup ? (
          <span className="flex items-center justify-center w-32 aspect-square rounded-full overflow-hidden">
            <img
              src={conversation?.group_picture || "default-pfp.jpg"}
              alt="group picture"
              className="w-full h-full object-cover"
            />
          </span>
        ) : (
          <span className="flex items-center justify-center w-32 aspect-square rounded-full overflow-hidden">
            <img
              src={
                conversationWithSelf
                  ? currentUser?.profile_picture || "default-pfp.jpg"
                  : recipients?.[0].profile_picture || "default-pfp.jpg"
              }
              alt="profile picture"
              className="w-full h-full object-cover"
            />
          </span>
        )}
        {conversation?.isGroup ? (
          <h2 className="text-2xl dark:text-white">
            {conversation?.title ? (
              conversation.title
            ) : conversation?.ownerId === currentUser?.id ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors underline decoration-dashed underline-offset-4"
              >
                Add a title
              </button>
            ) : (
              <span className="text-neutral-500 dark:text-neutral-400 italic">
                No title
              </span>
            )}
          </h2>
        ) : (
          <h2 className="text-2xl dark:text-white">
            {conversationWithSelf
              ? currentUser?.display_name
              : recipients?.[0].display_name}
          </h2>
        )}
      </div>

      {/* Members List for Group Chats */}
      {conversation?.isGroup && (
        <div className="flex-1 p-5">
          <h3 className="text-lg font-medium dark:text-white mb-4">
            Members ({conversation.participants.length})
          </h3>
          <div className="space-y-3">
            {conversation.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={participant.profile_picture || "default-pfp.jpg"}
                    alt={`${participant.display_name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-neutral-900 dark:text-white truncate">
                      {participant.display_name}
                    </h4>
                    {participant.id === currentUser?.id && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full flex-shrink-0">
                        You
                      </span>
                    )}
                    {conversation.ownerId === participant.id && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full flex-shrink-0">
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                    @{participant.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Conversation Modal */}
      <EditConversationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        conversation={conversation}
      />
    </div>
  );
};

export default ConversationInfo;
