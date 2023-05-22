import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

export const useEditAccount = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser, setCurrentUser } = useAuth();
  const { theme } = useTheme()

  return useMutation(
    async ({
      display_name,
      username,
      profile_picture
    }: {
      display_name: string;
      username: string;
      profile_picture: string;
    }) => {
      const res = await axiosPrivate.put(`/api/users/${currentUser?.id}`, {
        display_name,
        username,
        profile_picture
      });
      return res.data;
    },
    {
      onError: (err: AxiosError<{ message: string }>) => {
        console.error(err);
        toast.error(err.response?.data.message || "An unknown error occurred.", {
          style: {
            background: `${ theme === "light" ? "" : "#262626"}`,
            color: `${ theme === "light" ? "" : "#fff"}`
          }
        })
      },
      onSuccess: (data) => {
        console.log(data);
        setCurrentUser((prev) => ({
          ...prev!,
          display_name: data.display_name,
          username: data.username,
          profile_picture: data.profile_picture,
        }));
        toast.success("Profile has been updated!", {
          style: {
            background: `${ theme === "light" ? "" : "#262626"}`,
            color: `${ theme === "light" ? "" : "#fff"}`
          }
        })
      },
    }
  );
};
