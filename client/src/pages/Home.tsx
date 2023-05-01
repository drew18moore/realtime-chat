import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useEffect } from "react";

const Home = () => {
  const socket = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (receivedMessage) => {
        console.log("RECEIVED MESSAGE", receivedMessage);
      });
    }
    return () => {
      if (socket) {
        socket.off("receive-message")
      }
    }
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
