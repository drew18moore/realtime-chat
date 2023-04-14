import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const Home = () => {
  const [currentConversation, setCurrentConversation] = useState<Conversation>();

  return (
    <div className="flex ">
      <Sidebar currentConversation={currentConversation} setCurrentConversation={setCurrentConversation} />
      <div className="flex-grow h-screen">
        <Chat currentConversation={currentConversation}/>
      </div>
    </div>
  );
};

export default Home;
