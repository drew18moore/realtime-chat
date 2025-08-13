import { useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const ConversationInfo = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100svh)] min-w-0">
      <div className="flex-none flex items-center gap-3 py-2 px-5 sm:px-10 border-b border-b-neutral-200 dark:border-b-neutral-800 min-w-0">
        <button
          className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 dark:text-white dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <BiArrowBack size={"100%"} />
        </button>
        <h1 className="text-2xl dark:text-white">Conversation details</h1>
      </div>
      <div className="p-5 text-neutral-700 dark:text-neutral-300">
        <p>Conversation ID: {conversationId}</p>
        <p className="mt-2">This is a placeholder for conversation info.</p>
      </div>
    </div>
  );
};

export default ConversationInfo;
