import { FC, useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";

interface ChatProps {
  currentConversation: Conversation | undefined;
}

const Chat: FC<ChatProps> = ({ currentConversation }) => {
  const { currentUser } = useAuth();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get("/api/messages", {
        params: {
          currentUserId: currentUser?.id,
          conversationId: currentConversation?.id,
        },
      });
      console.log(res.data);
      setMessages(res.data);
    };
    if (currentConversation) {
      fetchPosts();
    }
  }, [currentConversation]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = messageInputRef?.current?.value;
    const receiverId = currentConversation?.users[0]?.id
    if (value !== "") {
      setMessages((prev) => [
        ...prev,
        {
          message: value!,
          receiverId: receiverId!,
          authorId: currentUser?.id!,
          created_at: new Date(Date.now()),
        },
      ]);
      const res = await api.post("/api/messages/new", {
        authorId: currentUser?.id,
        receiverId: currentConversation?.id,
        message: value
      })
      messageInputRef!.current!.value = "";
    }
  };
  return (
    <div className="relative h-screen">
      {/* Header bar */}
      <div className="flex items-center bg-white absolute top-0 right-0 left-0 h-14 px-10">
        <h1 className="text-2xl">{currentConversation?.users[0]?.username}</h1>
      </div>

      <div className="absolute top-14 bottom-20 w-full flex flex-col justify-end">
        <div className="grid gap-2 p-2 overflow-auto">
          {messages.map((message, i) => {
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

      <form
        onSubmit={sendMessage}
        className="bg-white absolute bottom-0 w-full h-20 px-5 flex items-center"
      >
        <input
          ref={messageInputRef}
          type="text"
          className="w-full rounded-full px-3 py-2 bg-neutral-300 placeholder:text-neutral-600"
          placeholder="Type a message..."
        />
      </form>
    </div>
  );
};

export default Chat;
