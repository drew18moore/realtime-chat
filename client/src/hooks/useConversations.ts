import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import { useAuth } from "../contexts/AuthContext";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const useGetConversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  return useQuery<Conversation[]>(["conversations"], async () => {
    const res = await axiosPrivate.get(`/api/users/${currentUser?.id}/conversations`)
    return res.data
  }, {
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useNewConversation = (joinerId: number) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Conversation>(async () => {
    const res = await axiosPrivate.post("/api/conversations/new", {
      creatorId: currentUser?.id,
      joinerId,
    })
    return res.data
  }, {
    onSuccess: (data) => {
      const prevConversations = queryClient.getQueryData<Conversation[]>(["conversations"])
      if (!prevConversations?.some((conv) => conv.id === data.id)) {
        queryClient.setQueryData(["conversations"], [...prevConversations!, data])
      }
      const state = { recipient: data.recipient };
      navigate(`/${data.id}`, { state })
    },
    onError: (err) => {
      console.log("ERROR", err);
    }
  });
}