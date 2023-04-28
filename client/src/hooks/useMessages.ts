import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import useAxiosPrivate from "./useAxiosPrivate";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useGetMessages = (conversationId: number) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return useQuery(
    ["messages", conversationId],
    () =>
      axiosPrivate.get("/api/messages", {
        params: { currentUserId: currentUser?.id, conversationId },
      }),
    {
      onError: (err: AxiosError) => {
        if (err.response?.status === 401) navigate("/");
      },
      retry: (failureCount, error) => {
        return error?.response?.status !== 401;
      },
      refetchOnWindowFocus: false,
    }
  );
}