import { FC } from "react";
import { useNewConversation } from "../hooks/useConversations";

interface ContactProps {
  img: string;
  id: number;
  displayName: string;
  username: string;
  clearSearch: () => void;
}

const Contact: FC<ContactProps> = ({
  img,
  id,
  displayName,
  username,
  clearSearch,
}) => {
  const { mutate: newConversation } = useNewConversation(id);

  return (
    <div
      onClick={() => {
        newConversation();
        clearSearch();
      }}
      className="rounded-xl flex gap-3 p-2 items-center cursor-pointer hover:bg-neutral-200"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={img}
          alt="profile picture"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg leading-5">{displayName}</h3>
        <h3 className="text-sm text-neutral-600">@{username}</h3>
      </div>
    </div>
  );
};

export default Contact;
