import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  return (
    <div className="flex dark:bg-black">
      <Sidebar />
      <div className={`flex-grow ${isRootRoute ? "hidden" : ""} sm:block`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
