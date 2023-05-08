import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  const socket = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (receivedMessage) => {
        const { conversationId, recipientId, authorId, message, timeSent } =
          receivedMessage;

        // Update conversations cache
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (prevConversations) => {
            const conversationIndex = prevConversations!.findIndex(
              (conv) => conv.id === conversationId
            );
            const updatedConversation: Conversation = {
              ...prevConversations![conversationIndex],
              lastMessageSent: {
                message,
                created_at: timeSent,
              },
            };
            const updatedConversations = [...prevConversations!];
            updatedConversations[conversationIndex] = updatedConversation;
            return updatedConversations;
          }
        );

        // Update messages cache
        const existingMessages = queryClient.getQueryData<Message[]>([
          "messages",
          conversationId,
        ]);
        if (existingMessages) {
          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (prevMessages) => [
              {
                message,
                receiverId: recipientId,
                authorId,
                created_at: timeSent,
              },
              ...prevMessages!,
            ]
          );
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("receive-message");
      }
    };
  }, [socket]);

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-grow ${isRootRoute ? "hidden" : ""} sm:block`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
