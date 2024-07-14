import React, { FC, useState, useRef } from "react";
import { FiMoreHorizontal, FiSmile } from "react-icons/fi";
import MessageDropdown from "./MessageDropdown";
import EmojiPickerDropdown from "./EmojiPickerDropdown";

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
  setMessageToEdit: React.Dispatch<React.SetStateAction<Message | null>>;
  addReaction: (messageId: number, reaction: string) => void;
}

const Message: FC<MessageProps> = ({
  message,
  isCurrentUser,
  setMessageToEdit,
  addReaction,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const toggleEmojiBtnRef = useRef<HTMLButtonElement>(null);

  // Format datetime
  const date = new Date(message?.created_at);
  let dateFormated;
  if (new Date().getTime() - date.getTime() < 86400000) {
    dateFormated = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    dateFormated = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  const handleEmojiClick = (emoji: string) => {
    addReaction(message.id, emoji);
    setShowEmojiSelector(false);
  };

  return (
    <div
      className={`${
        isCurrentUser ? "justify-self-end" : "justify-self-start"
      } grid max-w-xl relative`}
    >
      <div
        className={`flex gap-1 ${
          isCurrentUser
            ? "justify-self-end"
            : "justify-self-start flex-row-reverse"
        }`}
      >
        <div className="relative h-fit">
          {showDropdown && (
            <MessageDropdown
              setShowDropdown={setShowDropdown}
              toggleBtnRef={toggleBtnRef}
              isCurrentUser={isCurrentUser}
              message={message}
              setMessageToEdit={setMessageToEdit}
            />
          )}
          {showEmojiSelector && (
            <EmojiPickerDropdown
              onEmojiClick={handleEmojiClick}
              setShowDropdown={setShowEmojiSelector}
              toggleBtnRef={toggleEmojiBtnRef}
            />
          )}
          {isCurrentUser && (
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              ref={toggleBtnRef}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 text-xl text-neutral-600 dark:text-neutral-500 rounded-full w-fit h-fit"
            >
              <FiMoreHorizontal />
            </button>
          )}
          {!isCurrentUser && (
            <button
              className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 text-xl text-neutral-600 dark:text-neutral-500 rounded-full w-fit h-fit"
              onClick={() => setShowEmojiSelector((prev) => !prev)}
              ref={toggleEmojiBtnRef}
            >
              <FiSmile />
            </button>
          )}
        </div>

        <div
          className={`${
            isCurrentUser
              ? "bg-blue-600 text-white"
              : "bg-neutral-200 dark:bg-neutral-800 dark:text-white"
          } w-fit rounded-[1.25rem] px-2 py-[0.5rem] text-base leading-5 flex flex-col gap-1`}
        >
          {message.img !== "" && (
            <div className="rounded-xl overflow-hidden">
              <img src={message.img} alt="Message Image" />
            </div>
          )}
          {message.message !== "" && <p className="px-1">{message.message}</p>}
        </div>
      </div>
      {message.reactions.length > 0 && (
        <div
          className={`bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded-full w-fit ${
            isCurrentUser ? "ml-auto " : "mr-auto"
          } -translate-y-1 flex items-center gap-1`}
        >
          {message.reactions.map((reaction) => (
            <span key={reaction.id}>{reaction.emoji}</span>
          ))}
        </div>
      )}
      <div
        className={`${
          isCurrentUser ? "justify-self-end" : "justify-self-start"
        } text-neutral-600 dark:text-neutral-500 flex gap-1`}
      >
        {message.isEdited && (
          <>
            <p>Edited</p>
            <span>&#8226;</span>
          </>
        )}
        <p className={`text-neutral-600 dark:text-neutral-500`}>
          {dateFormated}
        </p>
      </div>
    </div>
  );
};

export default Message;
