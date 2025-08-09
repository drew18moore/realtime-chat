import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { useEffect, useRef } from "react";

export const useGetMessages = (conversationId: number) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  return useQuery<Message[]>(
    ["messages", conversationId],
    async () => {
      const res = await axiosPrivate.get("/api/messages", {
        params: { conversationId },
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useInfiniteQuery<Message[]>(
    ["messages", conversationId],
    async ({ pageParam = 1 }) => {
      const res = await axiosPrivate.get("/api/messages", {
        params: {
          conversationId,
          page: pageParam,
          limit: limit,
        },
      });
      return res.data;
    },
    {
      onSuccess: () => {
        // Set conversation isRead to true
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (prevConversations) => {
            if (prevConversations) {
              const conversationIndex = prevConversations!.findIndex(
                (conv) => conv.id === conversationId
              );
              const updatedConversation: Conversation = {
                ...prevConversations![conversationIndex],
                isRead: true,
              };
              const updatedConversations = [...prevConversations!];
              updatedConversations[conversationIndex] = updatedConversation;
              return updatedConversations;
            }
            return prevConversations;
          }
        );
      },
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
  message: string,
  img: string,
  replyToId?: number
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const location = useLocation();
  const pathnameRef = useRef<string>(location.pathname);
  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location]);

  return useMutation<Message>(
    async () => {
      const res = await axiosPrivate.post("/api/messages/new", {
        message: message,
        conversationId: conversationId,
        img: img,
        replyToId: replyToId,
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ["messages", conversationId],
          (prevData) => {
            const pages = prevData?.pages.map((page) => [...page]) ?? [];
            pages[0].unshift({
              ...data,
              reactions: [],
            });
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
                img: data.img,
                created_at: data.created_at,
              },
            };
            const updatedConversations = [...prevConversations!];
            updatedConversations[conversationIndex] = updatedConversation;
            return updatedConversations;
          }
        );

        // Send to other user
        socket?.emit("send-message", {
          id: data.id,
          authorId: data.authorId,
          recipientId,
          conversationId,
          message: data.message,
          img: data.img,
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

              let lastMessageSent;
              if (newLastMessageSent === undefined) {
                lastMessageSent = undefined;
              } else {
                lastMessageSent = {
                  id: newLastMessageSent!.id,
                  message: newLastMessageSent!.message,
                  img: newLastMessageSent!.img,
                  created_at: newLastMessageSent!.created_at,
                };
              }
              const updatedConversation: Conversation = {
                ...prevConversations![conversationIndex],
                lastMessageSent: lastMessageSent,
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

export const useEditMessage = (conversationId: number) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: { messageId: number; message: string }) => {
      const res = await axiosPrivate.put(`/api/messages/${data.messageId}`, {
        message: data.message,
      });
      return res.data;
    },
    {
      onSuccess: (data, variables) => {
        // Update message in query
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ["messages", conversationId],
          (prevData) => {
            if (prevData) {
              const updatedPages = prevData.pages.map((page) =>
                page.map((message) => {
                  if (message.id === variables.messageId) {
                    return {
                      ...message,
                      message: variables.message,
                      isEdited: true,
                    };
                  }
                  return message;
                })
              );
              return {
                ...prevData,
                pages: updatedPages,
              };
            }
            return prevData;
          }
        );
        // Update lastMessageSent in conversation query
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (prevConversations) => {
            if (prevConversations) {
              const updatedConversations = prevConversations.map(
                (conversation) => {
                  if (conversation.id === conversationId) {
                    return {
                      ...conversation,
                      lastMessageSent: {
                        ...conversation.lastMessageSent!,
                        message: variables.message,
                      },
                    };
                  }
                  return conversation;
                }
              );
              return updatedConversations;
            }
            return prevConversations;
          }
        );
      },
    }
  );
};

export const useReactMessage = (
  conversationId: number,
  userId: number,
  recipientId: number
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation(
    async (data: { messageId: number; emoji: string }) => {
      const res = await axiosPrivate.put<Reaction[]>(
        `/api/messages/${data.messageId}/react`,
        {
          emoji: data.emoji,
          userId: userId,
        }
      );
      return res.data;
    },
    {
      onSuccess: (data, variables) => {
        // Update message in query
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ["messages", conversationId],
          (prevData) => {
            if (prevData) {
              const updatedPages = prevData.pages.map((page) =>
                page.map((message) => {
                  if (message.id === variables.messageId) {
                    return {
                      ...message,
                      reactions: data,
                    };
                  }
                  return message;
                })
              );
              return {
                ...prevData,
                pages: updatedPages,
              };
            }
            return prevData;
          }
        );

        socket?.emit("react-to-message", {
          recipientId: recipientId,
          conversationId: conversationId,
          data: data,
        });
      },
    }
  );
};
