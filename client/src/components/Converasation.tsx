import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgLoadbarDoc } from "react-icons/cg";
import { MdVerified } from "react-icons/md";

interface ConverasationProps {
  lastMessage: string | undefined;
  dateLastMessage: Date | undefined;
  isSelected?: boolean;
  conversationId: number;
  recipient: {
    id: number;
    display_name: string;
    username: string;
    profile_picture?: string;
  };
  isOnline: boolean;
  isRead: boolean;
  conversationWithSelf: boolean;
}

const Converasation: FC<ConverasationProps> = ({
  lastMessage,
  dateLastMessage,
  isSelected = false,
  conversationId,
  recipient,
  isOnline,
  isRead,
  conversationWithSelf,
}) => {
  const navigate = useNavigate();
  const dateFormatted = dateLastMessage?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleClick = () => {
    const state = {
      recipient: {
        id: recipient.id,
        title: recipient.display_name,
        conversationWithSelf,
      },
    };
    navigate(`/${conversationId}`, { state });
  };

  useEffect(() => {
    console.log(dateLastMessage);
    console.log(dateFormatted);
  }, [dateFormatted, dateLastMessage])

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
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-purple-100 text-purple-700">
            {conversationWithSelf ? (
              <CgLoadbarDoc size={"2rem"} />
            ) : (
              <img
                src={recipient.profile_picture || "default-pfp.jpg"}
                alt="profile picture"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          {isOnline && !conversationWithSelf && (
            <div className="absolute bg-green-500 rounded-full w-3 h-3 bottom-0 right-0"></div>
          )}
        </div>

        <div className="grid items-center">
          <h2 className="text-xl dark:text-white flex items-center gap-2">
            {conversationWithSelf ? (
              <>
                <p>Note to self</p>
                <span className="text-blue-600">
                  <MdVerified />
                </span>
              </>
            ) : (
              recipient.display_name
            )}
          </h2>
          <p className="text-neutral-600 text-sm truncate dark:text-neutral-500">
            {lastMessage}
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse items-end self-end gap-1 text-sm text-neutral-600 flex-shrink-0 dark:text-neutral-500">
        <span>{dateFormatted}</span>
        {!isRead && (
          <span className="w-3 aspect-square bg-blue-600 rounded-full"></span>
        )}
      </div>
    </div>
  );
};

export default Converasation;
