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
  socket: Socket | undefined;
  onlineUserIds: number[];
};

const SocketContext = createContext<any>(undefined);

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const WS_URL = BASE_URL?.replace("http", "ws") || "ws://localhost:3000";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
  const location = useLocation();
  const queryClient = useQueryClient();
  const pathnameRef = useRef<string>(location.pathname);
  const prevConversationRef = useRef<string | null>(null);
  const { mutate: readConversation } = useReadConversation();

  useEffect(() => {
    pathnameRef.current = location.pathname;

    const match = location.pathname.match(/\/(\d+)/);
    const conversationId = match ? match[1] : null;

    if (socket) {
      if (
        prevConversationRef.current &&
        prevConversationRef.current !== conversationId
      ) {
        socket.emit("leave-conversation", prevConversationRef.current);
      }
      if (conversationId) {
        socket.emit("join-conversation", conversationId);
      }
    }
    prevConversationRef.current = conversationId;
  }, [location]);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(WS_URL, {
        transports: ["websocket"],
        query: { id: currentUser.id.toString() },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (userIds: number[]) => setOnlineUserIds(userIds);
    const handleUserConnected = (userId: number) =>
      setOnlineUserIds((prev) => [...prev, userId]);
    const handleUserDisconnected = (userId: number) =>
      setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
    const handleReceiveMessage = (receivedMessage: any) => {
      const {
        id,
        conversationId,
        recipientId,
        authorId,
        message,
        img,
        timeSent,
        replyToId,
        repliedToMessage,
      } = receivedMessage;
      console.log(
        "MESSAGE RECEIVED:",
        receivedMessage.message,
        "from",
        authorId,
        "to",
        recipientId
      );

      const isViewingConversation =
        pathnameRef.current === `/${conversationId}`;

      queryClient.setQueryData<Conversation[]>(
        ["conversations"],
        (prevConversations) => {
          console.log("UPDATE CONVERSATIONS (OLD):", prevConversations);
          if (!prevConversations) return prevConversations;
          const conversationIndex = prevConversations!.findIndex(
            (conv) => conv.id === conversationId
          );
          if (conversationIndex === -1) return prevConversations;
          const updatedConversation: Conversation = {
            ...prevConversations[conversationIndex],
            lastMessageSent: {
              id,
              message,
              img,
              created_at: timeSent,
            },
            isRead: isViewingConversation,
          };
          isViewingConversation && readConversation(conversationId);
          const updatedConversations = [...prevConversations!];
          updatedConversations[conversationIndex] = updatedConversation;
          console.log("UPDATED CONVERSATIONS (NEW):", updatedConversations);
          return updatedConversations;
        }
      );

      queryClient.setQueryData<InfiniteData<Message[]>>(
        ["messages", conversationId],
        (prevData) => {
          if (!prevData) return prevData;
          const pages = prevData?.pages.map((page) => [...page]);
          pages[0].unshift({
            id,
            message,
            img,
            authorId,
            reactions: [],
            created_at: timeSent,
            isEdited: false,
            replyToId,
            repliedToMessage,
          });
          return { ...prevData, pages };
        }
      );
    };

    const handleReceiveReaction = (receivedReaction: {
      conversationId: number;
      data: {
        id: number;
        messageId: number;
        emoji: string;
        count: number;
      }[];
    }) => {
      const { data, conversationId } = receivedReaction;
      const messageId = data[0].messageId;
      if (!messageId) return;

      queryClient.setQueryData<InfiniteData<Message[]>>(
        ["messages", conversationId],
        (prevData) => {
          if (!prevData) return prevData;
          const updatedPages = prevData.pages.map((page) =>
            page.map((message) =>
              message.id === messageId
                ? { ...message, reactions: data }
                : message
            )
          );
          return {
            ...prevData,
            pages: updatedPages,
          };
        }
      );
    };

    socket?.on("online-users", handleOnlineUsers);
    socket?.on("user-connected", handleUserConnected);
    socket?.on("user-disconnected", handleUserDisconnected);
    socket?.on("receive-message", handleReceiveMessage);
    socket?.on("receive-reaction", handleReceiveReaction);

    return () => {
      socket?.off("online-users", handleOnlineUsers);
      socket.off("user-connected", handleUserConnected);
      socket.off("user-disconnected", handleUserDisconnected);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("receive-reaction", handleReceiveReaction);
    };
  }, [socket, queryClient, readConversation]);

  const value: SocketContextType = {
    socket,
    onlineUserIds,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
