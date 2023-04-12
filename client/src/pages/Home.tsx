import { io } from "socket.io-client";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../api/api";

const Home = () => {
  const [conversations, setConversations] = useState<User[]>([]);
  const [currentConversation, setCurrentConversation] = useState<User>();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/api/users/all")
        setConversations(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchConversations()
    const socket = io("http://localhost:3000");
    socket.on("connection", (socket) => {
      console.log(socket);
    })
  }, [])


  return (
    <div className="flex ">
      <Sidebar users={conversations} currentConversation={currentConversation} setCurrentConversation={setCurrentConversation} />
      <div className="flex-grow h-screen">
        <Chat currentConversation={currentConversation}/>
      </div>
    </div>
  );
};

export default Home;
