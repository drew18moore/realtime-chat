import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useReadConversation } from "../hooks/useConversations";

type SocketContextType = {
  socket: Socket;
  onlineUserIds: number[];
};

const SocketContext = createContext<any>(undefined);

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
  const location = useLocation();
  const queryClient = useQueryClient();
  const pathnameRef = useRef<string>(location.pathname);
  const { mutate: readConversation } = useReadConversation();
  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location]);

  useEffect(() => {
    socket?.on("online-users", (userIds) => {
      setOnlineUserIds(userIds);
    });

    socket?.on("user-connected", (userId) => {
      setOnlineUserIds((prevUserIds) => [...prevUserIds, userId]);
    });

    socket?.on("user-disconnected", (userId) => {
      setOnlineUserIds((prevUserIds) =>
        prevUserIds.filter((id) => id !== userId)
      );
    });

    socket?.on("receive-message", (receivedMessage) => {
      const { id, conversationId, recipientId, authorId, message, img, timeSent } =
        receivedMessage;
      const isViewingConversation =
        pathnameRef.current === `/${conversationId}`;

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
            isRead: isViewingConversation,
          };
          isViewingConversation && readConversation(conversationId);
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
              img,
              authorId,
              created_at: timeSent,
              isEdited: false,
            });
            return { ...prevData!, pages };
          }
        );
      }
    });

    return () => {
      socket?.off("user-connected");
      socket?.off("user-disconnected");
    };
  }, [socket]);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(BASE_URL, {
        query: { id: currentUser.id.toString() },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  const value = {
    socket,
    onlineUserIds,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
