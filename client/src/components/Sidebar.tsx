import Converasation from "./Converasation";

const Sidebar = () => {
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
          <Converasation
            img={
              "https://yt3.ggpht.com/a/AGF-l7_d6d5tvILSHvz1N0a_P16ZcG6mlqNe3Zvkxg=s900-c-k-c0xffffffff-no-rj-mo"
            }
            username={"John Doe"}
            lastMessage="Hello World"
            dateLastMessage={new Date()}
            isSelected
          />
          <Converasation
            img={
              "https://th.bing.com/th/id/OIP.FXR6pmSDte-PA3sDvO2o6wHaE8?pid=ImgDet&rs=1"
            }
            username={"Jane Doe"}
            lastMessage="Hello World"
            dateLastMessage={new Date()}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
