import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { AxiosError } from "axios";

export const useEditAccount = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser, setCurrentUser } = useAuth();
  return useMutation(
    async ({
      display_name,
      username,
    }: {
      display_name: string;
      username: string;
    }) => {
      const res = await axiosPrivate.put(`/api/users/${currentUser?.id}`, {
        display_name,
        username,
      });
      return res.data;
    },
    {
      onError: (err: AxiosError<{ message: string }>) => {
        console.error(err);
      },
      onSuccess: (data) => {
        console.log(data);
        setCurrentUser((prev) => ({
          ...prev!,
          display_name: data.display_name,
          username: data.username,
        }));
      },
    }
  );
};
