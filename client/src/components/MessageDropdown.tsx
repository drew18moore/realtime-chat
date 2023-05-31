import React, { FC } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";
import { FiTrash2 } from "react-icons/fi";

interface MessageDropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
}

const MessageDropdown: FC<MessageDropdownProps> = ({ setShowDropdown, toggleBtnRef }) => {
  return (
    <Dropdown setShowDropdown={setShowDropdown} toggleBtnRef={toggleBtnRef}>
      <DropdownItem icon={<FiTrash2 />}>Delete</DropdownItem>
    </Dropdown>
  );
};

export default MessageDropdown;
