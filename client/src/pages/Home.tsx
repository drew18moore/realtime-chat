import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  const isNewRoute = location.pathname === "/new";
  return (
    <div className="flex dark:bg-black">
      <Sidebar />
      {!(isRootRoute || isNewRoute) && (
        <div className="flex-grow sm:block">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Home;
