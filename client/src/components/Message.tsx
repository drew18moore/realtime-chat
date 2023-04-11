import { FC } from "react";

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const Message: FC<MessageProps> = ({ message, isCurrentUser }) => {
  // Format datetime
  const date = new Date(message?.created_at);
  let dateFormated;
  if (new Date().getTime() - date.getTime() < 86400000) {
    dateFormated = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    dateFormated = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className={`${isCurrentUser ? "justify-self-end" : "justify-self-start"} grid`}>
      <div
        className={`${isCurrentUser ? "bg-blue-400" : "bg-neutral-300"} w-fit rounded-full px-2 py-1 ${isCurrentUser ? "justify-self-end" : "justify-self-start"}`}
      >
        {message.message}
      </div>
      <p className={`${isCurrentUser ? "justify-self-end" : "justify-self-start"}`}>{dateFormated}</p>
    </div>
  );
};

export default Message;
