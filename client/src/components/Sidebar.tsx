import Converasation from "./Converasation";

type SidebarProps = {
  users: User[];
  currentConversation: User | undefined;
  setCurrentConversation: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const Sidebar: React.FC<SidebarProps> = ({ users, currentConversation, setCurrentConversation }) => {
  return (
    <div className=" bg-white h-screen w-96 relative">
      <div className="flex absolute top-0 left-0 right-0 h-14 justify-center">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="h-fit m-auto px-3 py-1 rounded-full bg-gray-200"
            placeholder="Search"
          />
          <button className="bg-gray-200 h-fit rounded-full w-8">
            <img src="add.svg" alt="new conversation" />
          </button>
        </div>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2">
        <div className="grid gap-2">
          {users.map((user) => (
            <Converasation
              img={"default-pfp.jpg"}
              username={user.username}
              lastMessage="Hello World"
              dateLastMessage={new Date()}
              isSelected={user === currentConversation}
              onClick={() => setCurrentConversation(user)}
              key={user.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
