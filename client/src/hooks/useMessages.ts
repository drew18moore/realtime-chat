import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import useAxiosPrivate from "./useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

export const useGetMessages = (conversationId: number) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return useQuery<Message[]>(
    ["messages", conversationId],
    async () => {
      const res = await axiosPrivate.get("/api/messages", {
        params: { currentUserId: currentUser?.id, conversationId },
      });
      return res.data;
    },
    {
      onError: (err: any) => {
        if (err.response?.status === 401) navigate("/");
      },
      retry: (_, error: any) => {
        return error?.response?.status !== 401;
      },
      refetchOnWindowFocus: false,
    }
  );
};

export const useGetMessagesInfinite = (conversationId: number, limit = 20) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return useInfiniteQuery<Message[]>(
    ["messages", conversationId],
    async ({ pageParam = 1 }) => {
      const res = await axiosPrivate.get("/api/messages", {
        params: {
          currentUserId: currentUser?.id,
          conversationId,
          page: pageParam,
          limit: limit,
        },
      });
      return res.data;
    },
    {
      onError: (err: any) => {
        if (err.response?.status === 401) navigate("/");
      },
      retry: (_, error: any) => {
        return error?.response?.status !== 401;
      },
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    }
  );
};

export const useNewMessage = (
  conversationId: number,
  recipientId: number,
  message: string
) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation<Message>(
    async () => {
      const res = await axiosPrivate.post("/api/messages/new", {
        receiverId: recipientId,
        message: message,
        conversationId: conversationId,
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ["messages", conversationId],
          (prevData) => {
            const pages = prevData?.pages.map((page) => [...page]) ?? [];
            pages[0].unshift(data);
            return { ...prevData!, pages };
          }
        );
        // Update lastMessageSent
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (prevConversations) => {
            const conversationIndex = prevConversations!.findIndex(
              (conv) => conv.id === conversationId
            );
            const updatedConversation: Conversation = {
              ...prevConversations![conversationIndex],
              lastMessageSent: {
                id: data.id,
                message: data.message,
                created_at: data.created_at,
              },
            };
            const updatedConversations = [...prevConversations!];
            updatedConversations[conversationIndex] = updatedConversation;
            return updatedConversations;
          }
        );
        // Send to other user
        socket.emit("send-message", {
          id: data.id,
          authorId: data.authorId,
          recipientId,
          conversationId,
          message: data.message,
          timeSent: data.created_at,
        });
      },
      onError: (err) => {
        console.log("ERROR", err);
      },
    }
  );
};

export const useDeleteMessage = (conversationId: number) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation(
    async (messageId: number) => {
      const res = await axiosPrivate.delete(`/api/messages/${messageId}`);
      return res.data;
    },
    {
      onSuccess: (data) => {
        // Remove message from query
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ["messages", conversationId],
          (prevData) => {
            if (prevData) {
              const updatedPages = prevData!.pages.map((page) =>
                page.filter((message) => message.id !== data.messageId)
              );
              return { ...prevData, pages: updatedPages };
            }
            return prevData;
          }
        );
        // Update lastMessageSent in conversation query
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (prevConversations) => {
            const conversationIndex = prevConversations!.findIndex(
              (conv) => conv.id === conversationId
            );
            if (
              prevConversations![conversationIndex].lastMessageSent!.id ===
              data.messageId
            ) {
              let newLastMessageSent = null;
              const messagesData = queryClient.getQueryData<
                InfiniteData<Message[]>
              >(["messages", conversationId]);
              if (messagesData && messagesData.pages.length > 0) {
                const firstPage = messagesData.pages[0];
                newLastMessageSent = firstPage[0];
              }
              const updatedConversation: Conversation = {
                ...prevConversations![conversationIndex],
                lastMessageSent: {
                  id: newLastMessageSent!.id,
                  message: newLastMessageSent!.message,
                  created_at: newLastMessageSent!.created_at,
                },
              };
              const updatedConversations = [...prevConversations!];
              updatedConversations[conversationIndex] = updatedConversation;

              return updatedConversations;
            }
            return prevConversations;
          }
        );
      },
    }
  );
};
