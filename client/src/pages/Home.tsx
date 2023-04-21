import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  return (
    <div className="flex">
      <Sidebar conversations={conversations} setConversations={setConversations} />
      <div className="flex-grow h-screen">
        <Outlet context={[conversations, setConversations]} />
      </div>
    </div>
  );
};

export default Home;
