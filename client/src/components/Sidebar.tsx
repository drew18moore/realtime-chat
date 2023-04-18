import { useEffect, useState } from "react";
import Converasation from "./Converasation";
import Search from "./Search";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../contexts/AuthContext";
import Contact from "./Contact";
import { useNavigate, useParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults | undefined>(undefined);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosPrivate.get(
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
          {!searchResults
            ? conversations.map((conversation) => {
                return (
                  <Converasation
                    img={"default-pfp.jpg"}
                    username={conversation.users[0].username}
                    lastMessage={conversation.lastMessageSent.message}
                    dateLastMessage={
                      new Date(conversation.lastMessageSent.created_at)
                    }
                    isSelected={conversation.id.toString() === conversationId}
                    conversationId={conversation.id}
                    recipients={conversation.users}
                    key={conversation.id}
                  />
                );
              })
            : searchResults.users.length > 0 ? searchResults.users.map((result) => {
                return (
                  <Contact
                    img={"default-pfp.jpg"}
                    username={result.username}
                    key={result.id}
                  />
                );
              }) : <h2 className="text-center">No results found</h2>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
