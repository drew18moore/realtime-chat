import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";

const useLogout = () => {
  const { setCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  return useMutation(() => axiosPrivate.post("/api/auth/logout"), {
    onSuccess: () => {
      setCurrentUser(undefined);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export default useLogout;
