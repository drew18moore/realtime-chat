import { FC } from "react";
import Input from "./ui/Input";
import { BiCheck, BiSend, BiImageAlt } from "react-icons/bi";
import { FiEdit2, FiCornerUpLeft } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Resizer from "react-image-file-resizer";
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;

interface NewMessageInputFormProps {
  value: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  messageToEdit: Message | null;
  setMessageToEdit: React.Dispatch<React.SetStateAction<Message | null>>;
  messageToReply: Message | null;
  setMessageToReply: React.Dispatch<React.SetStateAction<Message | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
  imgBase64: string;
  setImgBase64: React.Dispatch<React.SetStateAction<string>>;
}

const NewMessageInputForm: FC<NewMessageInputFormProps> = ({
  value,
  onSubmit,
  onChange,
  messageToEdit,
  setMessageToEdit,
  messageToReply,
  setMessageToReply,
  inputRef,
  imgBase64,
  setImgBase64,
}) => {
  const isEditing = messageToEdit !== null;
  const isReplying = messageToReply !== null;

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        80,
        0,
        (uri) => {
          setImgBase64(uri as string);
        },
        "base64"
      );
    } else {
      setImgBase64("");
    }

    e.target.value = "";
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex-none w-full px-5 py-2 flex flex-col gap-2"
    >
      {imgBase64 && (
        <div>
          <div className="relative w-24">
            <button
              type="button"
              className="bg-neutral-400 absolute flex items-center rounded-full aspect-square p-2 top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setImgBase64("");
              }}
            >
              <IoClose size="1rem" />
            </button>
            <img
              src={imgBase64}
              alt="message image"
              className="aspect-square object-cover rounded-xl"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 w-full">
        <div className="w-full relative flex flex-col">
          {(isEditing || isReplying) && (
            <div className="absolute top-1/2 -translate-y-1/2 pl-3 text-blue-600 flex items-center gap-2 border-r-[1px] pr-2 border-blue-600">
              {isEditing ? <FiEdit2 /> : <FiCornerUpLeft />}
              <p className="text-sm">{isEditing ? "Editing" : "Replying"}</p>
            </div>
          )}
          <Input
            type="text"
            size="lg"
            placeholder="Type a message..."
            value={value}
            onChange={onChange}
            className={`${
              isEditing || isReplying
                ? `${
                    isEditing ? "pl-24" : "pl-[6.6rem]"
                  } outline outline-2 outline-blue-600`
                : ""
            }`}
            ref={inputRef}
          />
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={() => setMessageToEdit(null)}
            className={`bg-neutral-200 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 text-neutral-600 dark:text-neutral-500 dark:bg-neutral-800`}
          >
            <IoClose size={"100%"} />
          </button>
        )}

        {isReplying && (
          <button
            type="button"
            onClick={() => setMessageToReply(null)}
            className={`bg-neutral-200 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 text-neutral-600 dark:text-neutral-500 dark:bg-neutral-800`}
          >
            <IoClose size={"100%"} />
          </button>
        )}

        {!isEditing && !isReplying && (
          <>
            <input
              type="file"
              accept="image/jpeg, image/png"
              id="file"
              className="hidden"
              onChange={handleImgChange}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("CLICK");
                document.getElementById("file")?.click();
              }}
              type="button"
              className="bg-neutral-200 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 text-blue-600 dark:bg-neutral-800"
              aria-label="Upload Image"
            >
              <BiImageAlt size={"100%"} />
            </button>
          </>
        )}

        <button
          type="submit"
          className={`bg-neutral-200 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 ${
            value.trim() === "" && imgBase64 === ""
              ? "text-neutral-400 cursor-default"
              : "text-blue-600"
          } dark:bg-neutral-800`}
        >
          {isEditing ? <BiCheck size={"100%"} /> : <BiSend size={"100%"} />}
        </button>
      </div>
    </form>
  );
};

export default NewMessageInputForm;
