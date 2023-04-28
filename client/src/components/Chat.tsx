import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";
import { useLocation, useParams } from "react-router-dom";
import { useGetMessages, useNewMessage } from "../hooks/useMessages";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useGetMessages(parseInt(conversationId!));
  
  const { mutate: newMessage, isSuccess: messageHasBeenSent } = useNewMessage(
    parseInt(conversationId!),
    state?.recipient.id,
    message
  );

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newMessage();
  };
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setMessage("");
  }, [messageHasBeenSent])

  return (
    <div className="relative h-screen">
      {/* Header bar */}
      <div className="flex items-center bg-white absolute top-0 right-0 left-0 h-14 px-10">
        <h1 className="text-2xl">{state?.recipient.username}</h1>
      </div>

      <div className="absolute top-14 bottom-20 w-full flex flex-col justify-end">
        <div className="grid gap-2 p-2 overflow-auto relative">
          {messages?.data.map((message: Message, i: number) => {
            return (
              <Message
                message={message}
                key={i}
                isCurrentUser={message.authorId === currentUser?.id}
              />
            );
          })}
          <div ref={messagesEndRef} className="absolute bottom-0" />
        </div>
      </div>

      {conversationId && (
        <form
          onSubmit={sendMessage}
          className="bg-white absolute bottom-0 w-full h-20 px-5 flex items-center"
        >
          <input
            type="text"
            className="w-full rounded-full px-3 py-2 bg-neutral-300 placeholder:text-neutral-600"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      )}
    </div>
  );
};

export default Chat;
