import { FC, useRef, useState } from "react";
import { FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
import Dropdown, { DropdownItem } from "./Dropdown";

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const Message: FC<MessageProps> = ({ message, isCurrentUser }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
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

  return (
    <div
      className={`${
        isCurrentUser ? "justify-self-end" : "justify-self-start"
      } grid max-w-xl relative`}
    >
      <div
        className={`flex gap-1  ${
          isCurrentUser
            ? "justify-self-end"
            : "justify-self-start flex-row-reverse"
        }`}
      >
        <div className="relative h-fit">
          {showDropdown && (
            <Dropdown setShowDropdown={setShowDropdown} toggleBtnRef={toggleBtnRef}>
              <DropdownItem icon={<FiTrash2 />}>Delete</DropdownItem>
            </Dropdown>
          )}
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            ref={toggleBtnRef}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 text-xl text-neutral-600 dark:text-neutral-500 rounded-full w-fit h-fit"
          >
            <FiMoreHorizontal />
          </button>
        </div>

        <div
          className={`${
            isCurrentUser
              ? "bg-blue-600 text-white"
              : "bg-neutral-200 dark:bg-neutral-800 dark:text-white"
          } w-fit rounded-[1.25rem] px-3 py-[0.5rem] text-base leading-5`}
        >
          {message.message}
        </div>
      </div>

      <p
        className={`${
          isCurrentUser ? "justify-self-end" : "justify-self-start"
        } text-neutral-600 dark:text-neutral-500`}
      >
        {dateFormated}
      </p>
    </div>
  );
};

export default Message;
