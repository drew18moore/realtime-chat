import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";

export const useEditAccount = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  return useMutation(
    ({ display_name, username }: { display_name: string, username: string }) => {
      return axiosPrivate.put(
        `/api/users/${currentUser?.id}`,
        {
          display_name, username
        }
      );
    },
    {
      onError: (err) => {
        console.error(err);
      },
    }
  );
};