import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex-grow bg-gray-200 h-screen"></div>
    </div>
  );
};

export default Home;
