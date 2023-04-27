import { useQuery } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import { useAuth } from "../contexts/AuthContext";
import { AxiosResponse } from "axios";

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