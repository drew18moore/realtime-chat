import { FC } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ContactProps {
  img: string;
  id: number;
  username: string;
  clearSearch: () => void
}

const Contact: FC<ContactProps> = ({ img, id, username, clearSearch }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient()
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { mutate: newConversation } = useMutation(() => {
    return axiosPrivate.post("/api/conversations/new", {
      creatorId: currentUser?.id,
      joinerId: id,
    })
  }, {
    onSuccess: (data) => {
      clearSearch()
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

  return (
    <div
      onClick={() => newConversation()}
      className="rounded-xl flex gap-3 p-2 items-center cursor-pointer hover:bg-neutral-300"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={img}
          alt="profile picture"
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-lg">{username}</h2>
    </div>
  );
};

export default Contact;
