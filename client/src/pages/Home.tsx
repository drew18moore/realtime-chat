import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useEffect, useRef } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const pathnameRef = useRef<string>(location.pathname);
  useEffect(() => {
    console.log(location.pathname);
    pathnameRef.current = location.pathname;
  }, [location])
  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (receivedMessage) => {
        const { id, conversationId, recipientId, authorId, message, timeSent } =
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
                id: id,
                message,
                created_at: timeSent,
              },
              isRead: pathnameRef.current === `/${conversationId}` ? true : false,
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
          queryClient.setQueryData<InfiniteData<Message[]>>(
            ["messages", conversationId],
            (prevData) => {
              const pages = prevData?.pages.map((page) => [...page]) ?? [];
              pages[0].unshift({
                id,
                message,
                receiverId: recipientId,
                authorId,
                created_at: timeSent,
              });
              return { ...prevData!, pages };
            }
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
    <div className="flex dark:bg-black">
      <Sidebar />
      <div className={`flex-grow ${isRootRoute ? "hidden" : ""} sm:block`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
