import { io } from "socket.io-client";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../api/api";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users/all")
        setUsers(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [])

  const socket = io("http://localhost:3000");
  socket.on("connection", (socket) => {
    console.log(socket);
  })

  return (
    <div className="flex ">
      <Sidebar users={users} />
      <div className="flex-grow h-screen">
        <Chat username={"drew18moore"}/>
      </div>
    </div>
  );
};

export default Home;
