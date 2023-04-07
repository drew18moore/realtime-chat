const Sidebar = () => {
  return (
    <div className=" bg-white h-screen w-96 relative">
      <div className="flex absolute top-0 left-0 right-0 h-20 justify-center">
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
    </div>
  );
};

export default Sidebar;
