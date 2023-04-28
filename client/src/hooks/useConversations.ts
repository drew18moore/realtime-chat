import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import { useAuth } from "../contexts/AuthContext";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const useGetConversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  return useQuery<AxiosResponse<Conversation[]>>(["conversations"], () => {
    return axiosPrivate.get(`/api/users/${currentUser?.id}/conversations`)
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

  return useMutation(() => {
    return axiosPrivate.post("/api/conversations/new", {
      creatorId: currentUser?.id,
      joinerId,
    })
  }, {
    onSuccess: (data) => {
      const prevConversations: any = queryClient.getQueryData(["conversations"])
      console.log(prevConversations?.data);
      if (!prevConversations.data.some((conv: Conversation) => conv.id === data.data.id)) {
        queryClient.setQueryData(["conversations"], {
          ...prevConversations,
          data: [...prevConversations.data, data.data]
        })
      }
      const state = { recipient: data.data.recipient };
      navigate(`/${data.data.id}`, { state })
    },
    onError: (err) => {
      console.log("ERROR", err);
    }
  });
}