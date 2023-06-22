import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useGetConversations = () => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  return useQuery<Conversation[]>(
    ["conversations"],
    async () => {
      const res = await axiosPrivate.get(
        `/api/conversations/${currentUser?.id}`
      );
      return res.data;
    },
    {
      onError: (err) => {
        console.error(err);
      },
      refetchOnWindowFocus: false,
    }
  );
};

export const useNewConversation = (participants: number[]) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Conversation>(
    async () => {
      const res = await axiosPrivate.post("/api/conversations/new", {
        participants,
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        const prevConversations = queryClient.getQueryData<Conversation[]>([
          "conversations",
        ]);
        if (!prevConversations?.some((conv) => conv.id === data.id)) {
          queryClient.setQueryData(
            ["conversations"],
            [...prevConversations!, data]
          );
        }
        const state = { recipient: data.participants[0] };
        navigate(`/${data.id}`, { state });
      },
      onError: (err) => {
        console.log("ERROR", err);
      },
    }
  );
};

export const useReadConversation = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation(async (conversationId: number) => {
    const res = await axiosPrivate.put(`/api/conversations/${conversationId}/read`);
    return res.data;
  }, {
    onSuccess: (data) => {
      console.log("SUCCESS", data);
    }
  });
};
