import { FC } from "react";

interface ConverasationProps {
  img: string;
  username: string;
  lastMessage: string;
  dateLastMessage: Date;
  isSelected?: boolean;
}

const Converasation: FC<ConverasationProps> = ({
  img,
  username,
  lastMessage,
  dateLastMessage,
  isSelected = false,
}) => {
  const dateFormatted = dateLastMessage.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className={`${isSelected ? "bg-gray-200" : null} rounded-md flex gap-3 p-3 items-center justify-between`}>
      <div className="flex gap-3 items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <img
            src={img}
            alt="profile picture"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid items-center">
          <h2 className="text-xl">{username}</h2>
          <p className="text-gray-600 text-sm">{lastMessage}</p>
        </div>
      </div>
      <div className="flex self-start text-sm text-gray-600">
        {dateFormatted}
      </div>
    </div>
  );
};

export default Converasation;
