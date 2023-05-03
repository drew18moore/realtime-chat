import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";
import { useLocation, useParams } from "react-router-dom";
import { useGetMessages, useNewMessage } from "../hooks/useMessages";
import { BiSend } from "react-icons/bi";

interface ConversationState {
  recipient: {
    id: number;
    username: string;
  };
}

const Chat = () => {
  const { conversationId } = useParams();
  const state = useLocation().state as ConversationState;
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useGetMessages(parseInt(conversationId!));

  const { mutate: newMessage, isSuccess: messageHasBeenSent } = useNewMessage(
    parseInt(conversationId!),
    state?.recipient.id,
    message
  );

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") {
      setMessage("");
      return;
    }
    newMessage();
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessage("");
  }, [messageHasBeenSent]);

  return (
    <div className="relative h-screen">
      {/* Header bar */}
      <div className="flex items-center bg-white absolute top-0 right-0 left-0 h-14 px-10">
        <h1 className="text-2xl">{state?.recipient.username}</h1>
      </div>

      <div className="absolute top-14 bottom-20 w-full flex flex-col justify-end">
        <div
          ref={messagesContainerRef}
          className="grid gap-2 p-2 overflow-auto relative"
        >
          {messages?.data.map((message: Message, i: number) => {
            return (
              <Message
                message={message}
                key={i}
                isCurrentUser={message.authorId === currentUser?.id}
              />
            );
          })}
        </div>
      </div>

      {conversationId && (
        <form
          onSubmit={sendMessage}
          className="bg-white absolute bottom-0 w-full h-20 px-5 flex items-center gap-2"
        >
          <input
            type="text"
            className="w-full rounded-full px-4 py-3 bg-neutral-300 placeholder:text-neutral-600"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`bg-neutral-300 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 ${
              message.trim() === ""
                ? "text-neutral-400 cursor-default"
                : "text-blue-600"
            }`}
          >
            <BiSend size={"fill"} />
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
