import { axiosPrivate } from "../../api/api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";

const logout = () => {
  return axiosPrivate.post("/api/auth/logout");
};

const useLogout = () => {
  const { setCurrentUser } = useAuth();

  return useMutation(
    logout, {
      onSuccess: () => {
        setCurrentUser(undefined)
      },
      onError: (err) => {
        console.error(err)
      }
    }
  )
}

export default useLogout