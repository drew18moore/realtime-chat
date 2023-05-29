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
    id: number;
    display_name: string;
  };
  isOnline: boolean;
}

const Converasation: FC<ConverasationProps> = ({
  img,
  displayName,
  lastMessage,
  dateLastMessage,
  isSelected = false,
  conversationId,
  recipient,
  isOnline,
}) => {
  const navigate = useNavigate();
  const dateFormatted = dateLastMessage?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleClick = () => {
    const state = { recipient };
    navigate(`/${conversationId}`, { state });
  };

  return (
    <div
      onClick={handleClick}
      className={`${
        isSelected
          ? "bg-neutral-200 dark:bg-neutral-800"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
      } rounded-xl flex gap-3 p-3 items-center justify-between cursor-pointer`}
    >
      <div className="flex gap-3 items-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
            <img
              src={img}
              alt="profile picture"
              className="object-cover w-full h-full"
            />
          </div>
          {isOnline && (
            <div className="absolute bg-green-500 rounded-full w-3 h-3 bottom-0 right-0"></div>
          )}
        </div>

        <div className="grid items-center">
          <h2 className="text-xl dark:text-white">{displayName}</h2>
          <p className="text-neutral-600 text-sm truncate dark:text-neutral-500">
            {lastMessage}
          </p>
        </div>
      </div>
      <div className="flex self-start text-sm text-neutral-600 flex-shrink-0 dark:text-neutral-500">
        {dateFormatted}
      </div>
    </div>
  );
};

export default Converasation;
