import { useEffect, useState } from "react";
import Converasation from "./Converasation";
import Search from "./Search";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import Contact from "./Contact";

type SidebarProps = {
  currentConversation: Conversation | undefined;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
};

const Sidebar: React.FC<SidebarProps> = ({
  currentConversation,
  setCurrentConversation,
}) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get(
          `/api/users/${currentUser?.id}/conversations`
        );
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className=" bg-neutral-100 h-screen w-96 relative border border-r-neutral-300">
      <div className="flex absolute top-0 left-0 right-0 h-14 justify-center">
        <Search setSearchResults={setSearchResults} />
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2">
        <div className="grid gap-2">
          {searchResults.length === 0
            ? conversations.map((conversation) => {
                return (
                  <Converasation
                    img={"default-pfp.jpg"}
                    username={conversation.users[0].username}
                    lastMessage={conversation.lastMessageSent.message}
                    dateLastMessage={
                      new Date(conversation.lastMessageSent.created_at)
                    }
                    isSelected={conversation === currentConversation}
                    onClick={() => setCurrentConversation(conversation)}
                    key={conversation.id}
                  />
                );
              })
            : searchResults.map((result) => {
                return (
                  <Contact
                    img={"default-pfp.jpg"}
                    username={result.username}
                    key={result.id}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
