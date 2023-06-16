import { FC } from "react";
import Input from "./ui/Input";
import { BiSend } from "react-icons/bi";

interface NewMessageInputFormProps {
  value: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const NewMessageInputForm: FC<NewMessageInputFormProps> = ({ value, onSubmit, onChange }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="absolute bottom-0 w-full h-20 px-5 flex items-center gap-2"
    >
      <Input
        type="text"
        size="lg"
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
      />
      <button
        type="submit"
        className={`bg-neutral-200 rounded-full h-12 aspect-square flex items-center justify-center p-2.5 ${
          value.trim() === ""
            ? "text-neutral-400 cursor-default"
            : "text-blue-600"
        } dark:bg-neutral-800`}
      >
        <BiSend size={"100%"} />
      </button>
    </form>
  );
};

export default NewMessageInputForm;
