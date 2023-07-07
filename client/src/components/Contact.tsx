import { FC } from "react";
import { useNewConversation } from "../hooks/useConversations";
import { CgLoadbarDoc } from "react-icons/cg";
import { MdVerified } from "react-icons/md";

interface ContactProps {
  img: string;
  id: number;
  displayName: string;
  username: string;
  clearSearch: () => void;
  isCurrentUser: boolean;
}

const Contact: FC<ContactProps> = ({
  img,
  id,
  displayName,
  username,
  clearSearch,
  isCurrentUser,
}) => {
  const { mutate: newConversation } = useNewConversation([id]);

  return (
    <div
      onClick={() => {
        newConversation();
        clearSearch();
      }}
      className="rounded-xl flex gap-3 p-2 items-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center bg-purple-100 text-purple-700">
        {isCurrentUser ? (
          <CgLoadbarDoc size={"1.5rem"} />
        ) : (
          <img
            src={img}
            alt="profile picture"
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg leading-5 dark:text-white flex items-center gap-2">
          {isCurrentUser ? (
            <>
              <p>Note to self</p>
              <span className="text-blue-600">
                <MdVerified />
              </span>
            </>
          ) : (
            displayName
          )}
        </h3>
        {!isCurrentUser && <h3 className="text-sm text-neutral-600 dark:text-neutral-500">
          @{username}
        </h3>}
      </div>
    </div>
  );
};

export default Contact;
