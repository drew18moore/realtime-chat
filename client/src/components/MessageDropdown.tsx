import React, { FC } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";
import { FiEdit2, FiTrash2, FiCornerUpLeft } from "react-icons/fi";
import { useDeleteMessage } from "../hooks/useMessages";
import { useParams } from "react-router-dom";

interface MessageDropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
  isCurrentUser: boolean;
  message: Message;
  setMessageToEdit: React.Dispatch<React.SetStateAction<Message | null>>;
  setMessageToReply: React.Dispatch<React.SetStateAction<Message | null>>;
}

const MessageDropdown: FC<MessageDropdownProps> = ({
  setShowDropdown,
  toggleBtnRef,
  isCurrentUser,
  message,
  setMessageToEdit,
  setMessageToReply,
}) => {
  const { conversationId } = useParams();
  const { mutate: deleteMessage } = useDeleteMessage(parseInt(conversationId!));
  return (
    <Dropdown
      setShowDropdown={setShowDropdown}
      toggleBtnRef={toggleBtnRef}
      orientation="horizontal"
    >
      <DropdownItem
        icon={<FiCornerUpLeft />}
        onClick={() => {
          setMessageToReply(message);
          setMessageToEdit(null);
        }}
        setShowDropdown={setShowDropdown}
      >
        Reply
      </DropdownItem>
      {isCurrentUser && (
        <DropdownItem
          icon={<FiTrash2 />}
          onClick={() => deleteMessage(message.id)}
          setShowDropdown={setShowDropdown}
          variant="danger"
        />
      )}
      {isCurrentUser && (
        <DropdownItem
          icon={<FiEdit2 />}
          onClick={() => {
            setMessageToEdit(message);
            setMessageToReply(null);
          }}
          setShowDropdown={setShowDropdown}
        />
      )}
    </Dropdown>
  );
};

export default MessageDropdown;
