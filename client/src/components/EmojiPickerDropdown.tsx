import React, { FC } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

interface EmojiPickerDropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
  onEmojiClick: (emoji: string) => void
}

const emojis = ["👍", "❤️", "😂", "😮", "😢"];

const EmojiPickerDropdown: FC<EmojiPickerDropdownProps> = ({
  setShowDropdown,
  toggleBtnRef,
  onEmojiClick,
}) => {
  return (
    <Dropdown
      setShowDropdown={setShowDropdown}
      toggleBtnRef={toggleBtnRef}
      orientation="horizontal"
    >
      {emojis.map((emoji, i) => (
        <DropdownItem
          key={i}
          icon={<span className="text-lg">{emoji}</span>}
          onClick={() => onEmojiClick(emoji)}
          setShowDropdown={setShowDropdown}
          className="p-2"
        />
      )
      )}
    </Dropdown>
  );
};

export default EmojiPickerDropdown;
