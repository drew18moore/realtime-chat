import React, { FC } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";
import { FiTrash2 } from "react-icons/fi";
import { useDeleteMessage } from "../hooks/useMessages";
import { useParams } from "react-router-dom";

interface MessageDropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
  isCurrentUser: boolean;
  messageId: number
}

const MessageDropdown: FC<MessageDropdownProps> = ({ setShowDropdown, toggleBtnRef, isCurrentUser, messageId }) => {
  const { conversationId } = useParams();
  const { mutate: deleteMessage } = useDeleteMessage(parseInt(conversationId!));
  return (
    <Dropdown setShowDropdown={setShowDropdown} toggleBtnRef={toggleBtnRef}>
      {isCurrentUser && <DropdownItem icon={<FiTrash2 />} onClick={() => deleteMessage(messageId)}>Delete</DropdownItem>}
    </Dropdown>
  );
};

export default MessageDropdown;
