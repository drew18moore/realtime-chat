import { FC } from "react";
import Input from "./ui/Input";
import { BiCheck, BiSend, BiImageAlt } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface NewMessageInputFormProps {
  value: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  messageToEdit: Message | null;
  setMessageToEdit: React.Dispatch<React.SetStateAction<Message | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
}

const NewMessageInputForm: FC<NewMessageInputFormProps> = ({
  value,
  onSubmit,
  onChange,
  messageToEdit,
  setMessageToEdit,
  inputRef,
}) => {
  const isEditing = messageToEdit !== null;
  return (
    <form
      onSubmit={onSubmit}
      className="absolute bottom-0 w-full h-20 px-5 flex items-center gap-2"
    >
      <div className="w-full relative">
        {isEditing && (
          <div className="absolute top-1/2 -translate-y-1/2 pl-3 text-blue-600 flex items-center gap-2 border-r-[1px] pr-2 border-blue-600">
            <FiEdit2 />
            <p className="text-sm">Editing</p>
          </div>
        )}
        <Input
          type="text"
          size="lg"
          placeholder="Type a message..."
          value={value}
          onChange={onChange}
          className={`${
            isEditing ? "pl-24 outline outline-2 outline-blue-600" : ""
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

      {!isEditing && (
        <>
          <input
            type="file"
            accept="image/jpeg, image/png"
            id="file"
            className="hidden"
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
          value.trim() === ""
            ? "text-neutral-400 cursor-default"
            : "text-blue-600"
        } dark:bg-neutral-800`}
      >
        {isEditing ? <BiCheck size={"100%"} /> : <BiSend size={"100%"} />}
      </button>
    </form>
  );
};

export default NewMessageInputForm;
