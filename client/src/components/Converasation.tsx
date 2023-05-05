import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface ConverasationProps {
  img: string;
  displayName: string;
  lastMessage: string | undefined;
  dateLastMessage: Date | undefined;
  isSelected?: boolean;
  conversationId: number;
  recipient: {
    id: number
    display_name: string
  }
}

const Converasation: FC<ConverasationProps> = ({
  img,
  displayName,
  lastMessage,
  dateLastMessage,
  isSelected = false,
  conversationId,
  recipient
}) => {
  const navigate = useNavigate()
  const dateFormatted = dateLastMessage?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleClick = () => {
    const state = { recipient }
    navigate(`/${conversationId}`, { state })
  }

  return (
    <div onClick={handleClick} className={`${isSelected ? "bg-neutral-200" : "hover:bg-neutral-100"} rounded-xl flex gap-3 p-3 items-center justify-between cursor-pointer`}>
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={img}
            alt="profile picture"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid items-center">
          <h2 className="text-xl">{displayName}</h2>
          <p className="text-neutral-600 text-sm truncate">{lastMessage}</p>
        </div>
      </div>
      <div className="flex self-start text-sm text-neutral-600 flex-shrink-0">
        {dateFormatted}
      </div>
    </div>
  );
};

export default Converasation;
