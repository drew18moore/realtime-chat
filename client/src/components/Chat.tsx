import { FC } from "react";

interface ChatProps {
  username: String;
}

const Chat: FC<ChatProps> = ({ username }) => {
  return (
    <div className="relative h-screen">
      {/* Header bar */}
      <div className="flex items-center bg-white absolute top-0 right-0 left-0 h-14 px-10">
        <h1 className="text-2xl">{username}</h1>
      </div>

      <div className="absolute top-14 bottom-20 w-full bg-gray-200 rounded-tl-md rounded-bl-md"></div>

      <div className="bg-white absolute bottom-0 w-full h-20 px-5 flex items-center">
        <input
          type="text"
          className="w-full rounded-full px-3 py-2 bg-gray-200"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default Chat;
