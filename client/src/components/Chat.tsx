import { FC, useEffect, useRef, useState } from "react";

interface ChatProps {
  username: String;
}

const Chat: FC<ChatProps> = ({ username }) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = messageInputRef?.current?.value;
    console.log(messageInputRef?.current?.value);
    setMessages((prev) => [...prev, value!]);
    messageInputRef!.current!.value = "";
  };
  return (
    <div className="relative h-screen">
      {/* Header bar */}
      <div className="flex items-center bg-white absolute top-0 right-0 left-0 h-14 px-10">
        <h1 className="text-2xl">{username}</h1>
      </div>

      <div className="absolute top-14 bottom-20 w-full bg-gray-200 rounded-tl-md rounded-bl-md flex flex-col justify-end">
        <div className="grid gap-2 p-2 overflow-auto">
          {messages.map((message, i) => {
            return (
              <div className={`bg-blue-400 w-fit rounded-full px-2 py-1 justify-self-end`} key={i}>{message.toString()}</div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={sendMessage}
        className="bg-white absolute bottom-0 w-full h-20 px-5 flex items-center"
      >
        <input
          ref={messageInputRef}
          type="text"
          className="w-full rounded-full px-3 py-2 bg-gray-200"
          placeholder="Type a message..."
        />
      </form>
    </div>
  );
};

export default Chat;
