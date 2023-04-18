import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface ConverasationProps {
  img: string;
  username: string;
  lastMessage: string;
  dateLastMessage: Date;
  isSelected?: boolean;
  conversationId: number;
  recipients: {
    id: number
    username: string
  }[]
}

const Converasation: FC<ConverasationProps> = ({
  img,
  username,
  lastMessage,
  dateLastMessage,
  isSelected = false,
  conversationId,
  recipients
}) => {
  const navigate = useNavigate()
  const dateFormatted = dateLastMessage.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClick = () => {
    const state = { recipients }
    navigate(`/${conversationId}`, { state })
  }

  return (
    <div onClick={handleClick} className={`${isSelected ? "bg-neutral-300" : null} rounded-xl flex gap-3 p-3 items-center justify-between cursor-pointer`}>
      <div className="flex gap-3 items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={img}
            alt="profile picture"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid items-center">
          <h2 className="text-xl">{username}</h2>
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
