import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth()

  const { data: conversations } = useQuery(["conversations"], () => {
    return axiosPrivate.get(`/api/users/${currentUser?.id}/conversations`)
  }, {
    onError: (err) => {
      console.log("ERROR", err);
    },
    refetchOnWindowFocus: false
  })
  
  return (
    <div className="flex">
      <Sidebar conversations={conversations?.data as Conversation[]} />
      <div className="flex-grow h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
