import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";


const Home = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex-grow h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
