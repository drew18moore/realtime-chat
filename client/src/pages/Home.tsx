import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (receivedMessage) => {
        console.log("RECEIVED MESSAGE", receivedMessage);
        const { conversationId, recipientId, authorId, message, timeSent } =
          receivedMessage;

        // Update conversations cache
        queryClient.setQueryData(
          ["conversations"],
          (prevConversations: any) => {
            const conversationIndex: number = prevConversations.data.findIndex(
              (conv: Conversation) => conv.id === conversationId
            );
            const updatedConversation: Conversation = {
              ...prevConversations.data[conversationIndex],
              lastMessageSent: {
                message,
                created_at: timeSent,
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

        // Update messages cache
        const existingMessages = queryClient.getQueryData([
          "messages",
          conversationId,
        ]);
        if (existingMessages) {
          queryClient.setQueryData(
            ["messages", conversationId],
            (prevMessages: any) => ({
              ...prevMessages,
              data: [
                ...prevMessages.data,
                {
                  message,
                  receiverId: recipientId,
                  authorId,
                  created_at: timeSent,
                },
              ],
            })
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
      <div className="flex-grow h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
