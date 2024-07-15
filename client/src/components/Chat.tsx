import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Message from "./Message";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useEditMessage,
  useGetMessagesInfinite,
  useNewMessage,
  useReactMessage,
} from "../hooks/useMessages";
import { BiArrowBack } from "react-icons/bi";
import NewMessageInputForm from "./NewMessageInputForm";
import { MdVerified } from "react-icons/md";

const Chat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const state = useLocation().state as ConversationState;
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [imgBase64, setImgBase64] = useState("");
  const [showMoreClicked, setShowMoreClicked] = useState(false);

  const LIMIT = 20;
  const { data: messages, fetchNextPage } = useGetMessagesInfinite(
    parseInt(conversationId!),
    LIMIT
  );

  const { mutate: newMessage, isSuccess: messageHasBeenSent } = useNewMessage(
    parseInt(conversationId!),
    state?.recipient.id,
    message,
    imgBase64
  );

  const { mutate: editMessage, isSuccess: messageHasBeenUpdated } =
    useEditMessage(parseInt(conversationId!));

  const { mutate: reactToMessage } = useReactMessage(parseInt(conversationId!), currentUser!.id, state?.recipient.id);

  useEffect(() => {
    setMessage(() => {
      if (messageToEdit?.message) return messageToEdit.message;
      return "";
    });
  }, [messageToEdit]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "" && imgBase64 === "") {
      setMessage("");
      return;
    }
    newMessage();
  };

  const updateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") {
      setMessage("");
      return;
    }
    editMessage({ messageId: messageToEdit?.id!, message });
  };

  useEffect(() => {
    setMessage("");
    setImgBase64("");
    setMessageToEdit(null);
    inputRef.current?.focus();
  }, [conversationId]);

  useEffect(() => {
    if (messagesContainerRef.current && !showMoreClicked) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    } else if (showMoreClicked) {
      setShowMoreClicked(false);
    }
  }, [messages]);

  useEffect(() => {
    setMessage("");
    setMessageToEdit(null);
    setImgBase64("");
  }, [messageHasBeenSent, messageHasBeenUpdated]);

  const handleAddReaction = (messageId: number, emoji: string) => {
    reactToMessage({ messageId, emoji })
  };

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
        <h1 className="text-2xl dark:text-white flex items-center gap-2">
          {state?.recipient.conversationWithSelf ? (
            <>
              <p>Note to self</p>
              <span className="text-blue-600">
                <MdVerified />
              </span>
            </>
          ) : (
            state?.recipient.title
          )}
        </h1>
      </div>

      <div className="absolute top-14 bottom-20 min-h-0 w-full flex flex-col justify-end">
        <div
          ref={messagesContainerRef}
          className="grid gap-2 p-2 pb-8 overflow-y-auto relative"
        >
          {messages?.pages[messages.pages.length - 1].length! >= LIMIT && (
            <button
              onClick={() => {
                setShowMoreClicked(true);
                fetchNextPage();
              }}
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
                      setMessageToEdit={setMessageToEdit}
                      addReaction={handleAddReaction}
                    />
                  );
                });
            })}
        </div>
      </div>

      {conversationId && (
        <NewMessageInputForm
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onSubmit={messageToEdit !== null ? updateMessage : sendMessage}
          messageToEdit={messageToEdit}
          setMessageToEdit={setMessageToEdit}
          inputRef={inputRef}
          imgBase64={imgBase64}
          setImgBase64={setImgBase64}
        />
      )}
    </div>
  );
};

export default Chat;
