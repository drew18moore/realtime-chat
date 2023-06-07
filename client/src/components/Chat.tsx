import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetMessagesInfinite, useNewMessage } from "../hooks/useMessages";
import { BiSend, BiArrowBack } from "react-icons/bi";
import Input from "./ui/Input";

interface ConversationState {
  recipient: {
    id: number;
    display_name: string;
  };
}

const Chat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const state = useLocation().state as ConversationState;
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const LIMIT = 20;
  const { data: messages, fetchNextPage } = useGetMessagesInfinite(
    parseInt(conversationId!),
    LIMIT
  );

  const { mutate: newMessage, isSuccess: messageHasBeenSent } = useNewMessage(
    parseInt(conversationId!),
    state?.recipient.id,
    message
  );

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") {
      setMessage("");
      return;
    }
    newMessage();
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessage("");
  }, [messageHasBeenSent]);

  return (
    <div className="relative h-[calc(100svh)]">
      {/* Header bar */}
      <div className="flex items-center gap-3 absolute top-0 right-0 left-0 h-14 px-5 sm:px-10 border border-b-neutral-200 border-x-0 border-t-0 dark:border-b-neutral-800">
        <button
          className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 sm:hidden dark:text-white dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
        >
          <BiArrowBack size={"100%"} />
        </button>
        <h1 className="text-2xl dark:text-white">
          {state?.recipient.display_name}
        </h1>
      </div>

      <div className="absolute top-14 bottom-20 w-full flex flex-col justify-end">
        <div
          ref={messagesContainerRef}
          className="grid gap-2 p-2 pb-8 overflow-y-auto relative"
        >
          {messages?.pages[messages.pages.length - 1].length! >= LIMIT && (
            <button
              onClick={() => fetchNextPage()}
              className="cursor-pointer w-fit px-2 py-1 text-blue-600 hover:underline mx-auto"
            >
              Show More
            </button>
          )}
          {messages?.pages
            .slice()
            .reverse()
            .map((page) => {
              return page
                .slice()
                .reverse()
                .map((message, i) => {
                  return (
                    <Message
                      message={message}
                      key={i}
                      isCurrentUser={message.authorId === currentUser?.id}
                    />
                  );
                });
            })}
        </div>
      </div>

      {conversationId && (
        <form
          onSubmit={sendMessage}
          className="absolute bottom-0 w-full h-20 px-5 flex items-center gap-2"
        >
          <Input
            type="text"
            size="lg"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`bg-neutral-200 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 ${
              message.trim() === ""
                ? "text-neutral-400 cursor-default"
                : "text-blue-600"
            } dark:bg-neutral-800`}
          >
            <BiSend size={"100%"} />
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
