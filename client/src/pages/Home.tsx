import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const updateConversationLastMessageSent = (conversationId: number, message: string, createdAt: Date) => {
    setConversations(prev => {
      const conversationIndex = prev.findIndex(conversation => conversation.id === conversationId);
      const updatedConversation = { ...prev[conversationIndex] };
      updatedConversation.lastMessageSent = {
        message: message,
        created_at: createdAt,
      };
      const updatedConversations = [...prev];
      updatedConversations[conversationIndex] = updatedConversation;

      return updatedConversations;
    });
  }
  
  return (
    <div className="flex">
      <Sidebar conversations={conversations} setConversations={setConversations} />
      <div className="flex-grow h-screen">
        <Outlet context={{ updateConversationLastMessageSent }} />
      </div>
    </div>
  );
};

export default Home;
