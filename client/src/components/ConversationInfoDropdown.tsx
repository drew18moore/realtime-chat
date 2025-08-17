import { FiLogOut, FiTrash2 } from "react-icons/fi";
import Dropdown, { DropdownItem } from "./Dropdown";
import { useDeleteConversation } from "../hooks/useConversations";
import { useParams } from "react-router-dom";

type ConversationInfoDropdownProps = {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
  isGroup: boolean;
  isOwner: boolean;
}

const ConversationInfoDropdown = ({
  setShowDropdown,
  toggleBtnRef,
  isGroup,
  isOwner,
}: ConversationInfoDropdownProps) => {
  const { conversationId } = useParams();
  const { mutate: deleteConversation } = useDeleteConversation();

  const handleDeleteConversation = () => {
    deleteConversation(parseInt(conversationId!));
  }
  
  return (
    <Dropdown setShowDropdown={setShowDropdown} toggleBtnRef={toggleBtnRef} orientation="vertical">
      {(isGroup && !isOwner) ? (
        <DropdownItem icon={<FiLogOut />} onClick={handleDeleteConversation} setShowDropdown={setShowDropdown} variant="danger">Leave</DropdownItem>
      ): (
        <DropdownItem icon={<FiTrash2 />} onClick={handleDeleteConversation} setShowDropdown={setShowDropdown} variant="danger">Delete</DropdownItem>
      )}
    </Dropdown>
  )
};

export default ConversationInfoDropdown;