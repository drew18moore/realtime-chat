import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { CgLoadbarDoc } from "react-icons/cg";
import { MdVerified } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

interface ConverasationProps {
  lastMessageSent?: {
    id: number;
    message: string;
    img: string;
    created_at: Date;
  };
  dateLastMessage: Date | undefined;
  isSelected?: boolean;
  conversationId: number;
  participants: {
    id: number;
    display_name: string;
    username: string;
    profile_picture?: string;
  }[];
  isOnline: boolean;
  isRead: boolean;
  conversationWithSelf: boolean;
  isGroup: boolean;
  groupPicture?: string;
}

const Converasation: FC<ConverasationProps> = ({
  lastMessageSent,
  dateLastMessage,
  isSelected = false,
  conversationId,
  participants,
  isOnline,
  isRead,
  conversationWithSelf,
  isGroup,
  groupPicture,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const dateFormatted = dateLastMessage?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  const lastMessage =
    lastMessageSent?.message === "" && lastMessageSent.img !== ""
      ? "Picture"
      : lastMessageSent?.message;
  const recipients = participants.filter(
    (participant) => participant.id !== currentUser?.id
  );

  const handleClick = () => {
    const state = {
      recipient: {
        id: participants[0].id,
        title: participants[0].display_name,
        conversationWithSelf,
      },
    };
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
      <div className="flex gap-3 items-center min-w-0">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-purple-100 text-purple-700">
            {conversationWithSelf ? (
              <CgLoadbarDoc size={"2rem"} />
            ) : isGroup && groupPicture ? (
              groupPicture
            ) : (
              <img
                src={recipients[0].profile_picture || "default-pfp.jpg"}
                alt="profile picture"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          {isOnline && !conversationWithSelf && (
            <div className="absolute bg-green-500 rounded-full w-3 h-3 bottom-0 right-0"></div>
          )}
        </div>

        <div className="grid items-center min-w-0">
          <h2 className="text-xl dark:text-white flex items-center gap-2 min-w-0">
            {conversationWithSelf ? (
              <>
                <span className="truncate">Note to self</span>
                <span className="text-blue-600 flex-shrink-0">
                  <MdVerified />
                </span>
              </>
            ) : isGroup ? (
              <span className="truncate">
                {recipients
                  .map((recipient) => recipient.display_name)
                  .join(", ")}
              </span>
            ) : (
              <span className="truncate">{recipients[0].display_name}</span>
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
