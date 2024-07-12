import React, { FC } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";
import { useDeleteMessage } from "../hooks/useMessages";
import { useParams } from "react-router-dom";

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
  const { conversationId } = useParams();
  const { mutate: deleteMessage } = useDeleteMessage(parseInt(conversationId!));
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
        />
      )
      )}
    </Dropdown>
  );
};

export default EmojiPickerDropdown;
