import { FC } from "react";

interface MessageProps {
  message: Message
}

const Message: FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`bg-blue-400 w-fit rounded-full px-2 py-1 justify-self-end`}
    >
      {message.message}
    </div>
  );
};

export default Message;
