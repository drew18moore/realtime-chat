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
      enabled: !!currentUser?.id,
      // Prevent unnecessary refetch when navigating back if cache exists
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
};

export const useNewConversation = (
  participants: number[],
  isGroup: boolean = false
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return useMutation<Conversation>(
    async () => {
      const res = await axiosPrivate.post("/api/conversations/new", {
        participants,
        isGroup,
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
            [data, ...prevConversations!]
          );
        }
        const conversationWithSelf =
          data.participants.length === 1 &&
          data.participants[0].id === currentUser?.id;
        const recipient = conversationWithSelf
          ? data.participants[0]
          : data.participants.filter(
              (participant) => participant.id !== currentUser?.id
            )[0];
        const state: ConversationState = {
          recipient: {
            id: recipient.id,
            title: recipient.display_name,
            conversationWithSelf: recipient.id === currentUser?.id,
          },
        };
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

  return useMutation(
    async (conversationId: number) => {
      const res = await axiosPrivate.put(
        `/api/conversations/${conversationId}/read`
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        console.log("SUCCESS", data);
      },
    }
  );
};

export const useGetConversation = (conversationId: number) => {
  const queryClient = useQueryClient();
  return useQuery<Conversation | undefined>(
    ["conversations", conversationId],
    () => {
      const conversations = queryClient.getQueryData<Conversation[]>([
        "conversations",
      ]);
      return conversations?.find(
        (conversation) => conversation.id === conversationId
      );
    },
    {
      enabled: !!conversationId,
    }
  );
};

export const useUpdateConversation = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      conversationId,
      title,
      img,
    }: {
      conversationId: number;
      title: string | null;
      img: string | null;
    }) => {
      const res = await axiosPrivate.patch(
        `/api/conversations/${conversationId}`,
        {
          title,
          img,
        }
      );
      return res.data as { id: number; title: string | null };
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData<Conversation[]>(["conversations"], (prev) => {
          if (!prev) return prev;
          const idx = prev.findIndex((c) => c.id === data.id);
          if (idx === -1) return prev;
          const updated: Conversation = { ...prev[idx], title: data.title };
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        });
      },
    }
  );
};
