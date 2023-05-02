import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import useAxiosPrivate from "./useAxiosPrivate";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

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
};

export const useNewMessage = (
  conversationId: number,
  recipientId: number,
  message: string
) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const socket = useSocket()

  return useMutation<AxiosResponse<Message>>(
    () =>
      axiosPrivate.post("/api/messages/new", {
        authorId: currentUser?.id,
        receiverId: recipientId,
        message: message,
        conversationId: conversationId,
      }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["messages", conversationId],
          (prevMessages: any) => ({
            ...prevMessages,
            data: [...prevMessages.data, data.data],
          })
        );
        // Update lastMessageSent
        queryClient.setQueryData(
          ["conversations"],
          (prevConversations: any) => {
            const conversationIndex: number = prevConversations.data.findIndex(
              (conv: Conversation) => conv.id === conversationId
            );
            const updatedConversation: Conversation = {
              ...prevConversations.data[conversationIndex],
              lastMessageSent: {
                message: data.data.message,
                created_at: data.data.created_at,
              },
            };
            const updatedConversations: Conversation[] = [
              ...prevConversations.data,
            ];
            updatedConversations[conversationIndex] = updatedConversation;
            return {
              ...prevConversations,
              data: updatedConversations,
            };
          }
        );
        // Send to other user
        socket.emit("send-message", { authorId: data.data.authorId, recipientId, conversationId, message: data.data.message, timeSent: data.data.created_at })
      },
      onError: (err) => {
        console.log("ERROR", err);
      },
    }
  );
};
