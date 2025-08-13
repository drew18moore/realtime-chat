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
import { useQueryClient } from "@tanstack/react-query";

const Chat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const state = useLocation().state as ConversationState;
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);
  const [messageToReply, setMessageToReply] = useState<Message | null>(null);
  const [imgBase64, setImgBase64] = useState("");
  const [showMoreClicked, setShowMoreClicked] = useState(false);

  const LIMIT = 20;
  const { data: messages, fetchNextPage } = useGetMessagesInfinite(
    parseInt(conversationId!),
    LIMIT
  );

  // Conversations metadata from cache
  const queryClient = useQueryClient();
  const conversations = queryClient.getQueryData<Conversation[]>([
    "conversations",
  ]);
  const conversationMeta = conversations?.find(
    (c) => c.id === parseInt(conversationId!)
  );
  const isGroup = conversationMeta?.isGroup ?? false;
  const participants = conversationMeta?.participants ?? [];

  const conversationWithSelf =
    (conversationMeta?.participants?.length === 1 &&
      conversationMeta.participants[0].id === currentUser?.id) ||
    false;

  const recipientIds = conversationWithSelf
    ? [currentUser!.id]
    : (conversationMeta?.participants || [])
        .map((p) => p.id)
        .filter((id) => id !== currentUser?.id);

  const { mutate: newMessage, isSuccess: messageHasBeenSent } = useNewMessage(
    parseInt(conversationId!),
    recipientIds,
    message,
    imgBase64,
    messageToReply?.id
  );

  const { mutate: editMessage, isSuccess: messageHasBeenUpdated } =
    useEditMessage(parseInt(conversationId!));

  const { mutate: reactToMessage } = useReactMessage(
    parseInt(conversationId!),
    currentUser!.id,
    recipientIds[0] ?? state?.recipient.id
  );

  useEffect(() => {
    setMessage(() => {
      if (messageToEdit?.message) return messageToEdit.message;
      return "";
    });
    inputRef.current?.focus();
  }, [messageToEdit]);

  useEffect(() => {
    if (messageToReply) {
      inputRef.current?.focus();
    }
  }, [messageToReply]);

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
    setMessageToReply(null);
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
    setMessageToReply(null);
    setImgBase64("");
  }, [messageHasBeenSent, messageHasBeenUpdated]);

  const handleAddReaction = (messageId: number, emoji: string) => {
    reactToMessage({ messageId, emoji });
  };

  return (
    <div className="flex flex-col h-[calc(100svh)] min-w-0">
      {/* Header bar */}
      <div className="flex-none flex items-center gap-3 py-2 px-5 sm:px-10 border-b border-b-neutral-200 dark:border-b-neutral-800 min-w-0">
        <button
          className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 sm:hidden dark:text-white dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
        >
          <BiArrowBack size={"100%"} />
        </button>
        <button
          type="button"
          onClick={() => navigate(`/${conversationId}/info`)}
          className="text-left text-2xl dark:text-white grid gap-2 min-w-0 hover:underline"
          aria-label="Open conversation info"
        >
          {state?.recipient.conversationWithSelf ? (
            <>
              <p className="truncate">Note to self</p>
              <span className="text-blue-600">
                <MdVerified />
              </span>
            </>
          ) : isGroup ? (
            <span className="truncate">
              {participants.map((p) => p.display_name).join(", ")}
            </span>
          ) : (
            state?.recipient.title
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 w-full flex flex-col justify-end">
        <div
          ref={messagesContainerRef}
          className="grid gap-2 p-2 overflow-y-auto"
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
          {(() => {
            const orderedMessages: Message[] =
              messages?.pages
                .slice()
                .reverse()
                .flatMap((page) => page.slice().reverse()) ?? [];

            const getAuthorInfo = (authorId: number) => {
              if (authorId === currentUser?.id) {
                return {
                  display_name: currentUser.display_name,
                  profile_picture: currentUser.profile_picture,
                };
              }
              const found = participants.find((p) => p.id === authorId);
              return {
                display_name: found?.display_name,
                profile_picture: found?.profile_picture,
              };
            };

            return orderedMessages.map((m, idx) => {
              const prev = idx > 0 ? orderedMessages[idx - 1] : undefined;
              const showAuthorHeader =
                isGroup &&
                m.authorId !== currentUser?.id &&
                (!prev || prev.authorId !== m.authorId);
              const authorInfo = getAuthorInfo(m.authorId);
              const next =
                idx < orderedMessages.length - 1
                  ? orderedMessages[idx + 1]
                  : undefined;
              const FIVE_MINUTES_MS = 5 * 60 * 1000;
              const showTimestamp =
                !next ||
                next.authorId !== m.authorId ||
                new Date(next.created_at).getTime() -
                  new Date(m.created_at).getTime() >
                  FIVE_MINUTES_MS;
              return (
                <Message
                  key={m.id}
                  message={m}
                  isCurrentUser={m.authorId === currentUser?.id}
                  setMessageToEdit={setMessageToEdit}
                  setMessageToReply={setMessageToReply}
                  addReaction={handleAddReaction}
                  showAuthorHeader={showAuthorHeader}
                  authorDisplayName={authorInfo.display_name}
                  authorProfilePicture={authorInfo.profile_picture}
                  showTimestamp={showTimestamp}
                />
              );
            });
          })()}
        </div>
      </div>

      {conversationId && (
        <NewMessageInputForm
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onSubmit={messageToEdit !== null ? updateMessage : sendMessage}
          messageToEdit={messageToEdit}
          setMessageToEdit={setMessageToEdit}
          messageToReply={messageToReply}
          setMessageToReply={setMessageToReply}
          inputRef={inputRef}
          imgBase64={imgBase64}
          setImgBase64={setImgBase64}
        />
      )}
    </div>
  );
};

export default Chat;
