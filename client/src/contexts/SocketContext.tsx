import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type SocketContextType = {
  socket: Socket;
  onlineUserIds: number[];
}

const SocketContext = createContext<any>(undefined);

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  useEffect(() => {
    socket?.on("online-users", (userIds) => {
      setOnlineUserIds(userIds);
    })

    socket?.on("user-connected", (userId) => {
      setOnlineUserIds((prevUserIds) => [...prevUserIds, userId])
    });

    socket?.on("user-disconnected", (userId) => {
      setOnlineUserIds((prevUserIds) => prevUserIds.filter((id) => id !== userId));
    });

    return () => {
      socket?.off("user-connected");
      socket?.off("user-disconnected");
    };
  }, [socket]);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(BASE_URL, { query: { id: currentUser.id.toString() } });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  const value = {
    socket,
    onlineUserIds,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
