import React, { FC } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";
import { FiTrash2 } from "react-icons/fi";

interface MessageDropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
  isCurrentUser: boolean;
}

const MessageDropdown: FC<MessageDropdownProps> = ({ setShowDropdown, toggleBtnRef, isCurrentUser }) => {
  return (
    <Dropdown setShowDropdown={setShowDropdown} toggleBtnRef={toggleBtnRef}>
      {isCurrentUser && <DropdownItem icon={<FiTrash2 />}>Delete</DropdownItem>}
    </Dropdown>
  );
};

export default MessageDropdown;
