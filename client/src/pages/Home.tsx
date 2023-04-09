import { io } from "socket.io-client";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const socket = io("http://localhost:3000");
  socket.on("connection", (socket) => {
    console.log(socket);
  })
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex-grow h-screen">
        <Chat username={"drew18moore"}/>
      </div>
    </div>
  );
};

export default Home;
