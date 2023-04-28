import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useParams } from "react-router-dom";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetMessages } from "../hooks/useMessages";

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
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { data: messages } = useGetMessages(parseInt(conversationId!));

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const { mutate: newMessage } = useMutation(
    () =>
      axiosPrivate.post("/api/messages/new", {
        authorId: currentUser?.id,
        receiverId: state.recipient.id,
        message: messageInputRef?.current?.value,
        conversationId: conversationId,
      }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["messages", conversationId],
          (prevMessages: any) => ({
            ...prevMessages,
            data: [...prevMessages.data, data.data],
          })
        );
        // Update lastMessageSent
        queryClient.setQueryData(
          ["conversations"],
          (prevConversations: any) => {
            const conversationIndex: number = prevConversations.data.findIndex(
              (conv: Conversation) => conv.id === parseInt(conversationId!)
            );
            const updatedConversation: Conversation = {
              ...prevConversations.data[conversationIndex],
              lastMessageSent: {
                message: data.data.message,
                created_at: data.data.created_at,
              },
            };
            const updatedConversations: Conversation[] = [
              ...prevConversations.data,
            ];
            updatedConversations[conversationIndex] = updatedConversation;
            return {
              ...prevConversations,
              data: updatedConversations,
            };
          }
        );
        messageInputRef!.current!.value = "";
      },
      onError: (err) => {
        console.log("ERROR", err);
      },
    }
  );

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newMessage();
  };

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
            ref={messageInputRef}
            type="text"
            className="w-full rounded-full px-3 py-2 bg-neutral-300 placeholder:text-neutral-600"
            placeholder="Type a message..."
          />
        </form>
      )}
    </div>
  );
};

export default Chat;
