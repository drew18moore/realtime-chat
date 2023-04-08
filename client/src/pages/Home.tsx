import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex-grow h-screen">
        <Chat username={"drew18moore"}/>
      </div>
    </div>
  );
};

export default Home;
