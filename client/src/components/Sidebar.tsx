import Converasation from "./Converasation";
import { FiSearch } from "react-icons/fi"

type SidebarProps = {
  conversations: Conversation[];
  currentConversation: Conversation | undefined;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<Conversation | undefined>
  >;
};

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversation,
  setCurrentConversation,
}) => {
  return (
    <div className=" bg-neutral-100 h-screen w-96 relative border border-r-neutral-300">
      <div className="flex absolute top-0 left-0 right-0 h-14 justify-center">
        <div className="flex items-center gap-5 w-full mx-5 relative">
          <div className="absolute h-4 pl-3 pointer-events-none text-neutral-600">
            <FiSearch />
          </div>
          <input
            type="text"
            className="h-fit m-auto px-3 py-1 rounded-full bg-neutral-300 placeholder:text-neutral-600 w-full pl-9"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2">
        <div className="grid gap-2">
          {conversations.map((conversation) => {
            return (
              <Converasation
                img={"default-pfp.jpg"}
                username={conversation.users[0].username}
                lastMessage={conversation.lastMessageSent.message}
                dateLastMessage={new Date(conversation.lastMessageSent.created_at)}
                isSelected={conversation === currentConversation}
                onClick={() => setCurrentConversation(conversation)}
                key={conversation.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
