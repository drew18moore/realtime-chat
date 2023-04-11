import { FC } from "react";

interface MessageProps {
  message: Message;
}

const Message: FC<MessageProps> = ({ message }) => {
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
    <div className="justify-self-end grid">
      <div
        className={`bg-blue-400 w-fit rounded-full px-2 py-1 justify-self-end`}
      >
        {message.message}
      </div>
      <p className="justify-self-end">{dateFormated}</p>
    </div>
  );
};

export default Message;
