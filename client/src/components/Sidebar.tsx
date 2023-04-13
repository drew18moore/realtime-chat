import Converasation from "./Converasation";

type SidebarProps = {
  conversations: Conversation[];
  currentConversation: Conversation | undefined;
  setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation | undefined>>;
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, currentConversation, setCurrentConversation }) => {
  return (
    <div className=" bg-neutral-100 h-screen w-96 relative border border-r-neutral-300">
      <div className="flex absolute top-0 left-0 right-0 h-14 justify-center">
        <div className="flex items-center gap-5">
          <input
            type="text"
            className="h-fit m-auto px-3 py-1 rounded-full bg-neutral-300 placeholder:text-neutral-600"
            placeholder="Search"
          />
          <button className="h-fit rounded-full w-6">
            <img src="add.svg" alt="new conversation" />
          </button>
        </div>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2">
        <div className="grid gap-2">
          {conversations.map((conversation) => (
            <Converasation
              img={"default-pfp.jpg"}
              username={conversation.users[0].username}
              lastMessage="Hello World"
              dateLastMessage={new Date()}
              isSelected={conversation === currentConversation}
              onClick={() => setCurrentConversation(conversation)}
              key={conversation.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
