import { FormEvent, useRef } from "react";
import { useEditAccount } from "../hooks/auth/useEditAccount";

const EditAccount = () => {
  const {
    mutate: editAccount,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useEditAccount();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const display_name = displayNameRef?.current?.value.trim() as string;
    const username = usernameRef?.current?.value.trim().toLowerCase() as string;
    console.log(display_name, username);
    editAccount({ display_name, username });
  };
  
  return (
    <div className="flex flex-col gap-4">
      <h3 className="dark:text-white">Profile</h3>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="flex flex-col">
          <label htmlFor="display-name" className="sr-only">
            Display Name
          </label>
          <input
            ref={displayNameRef}
            type="text"
            id="display-name"
            className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white"
            placeholder="Display Name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            ref={usernameRef}
            type="text"
            id="username"
            className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white"
            placeholder="Username"
          />
        </div>
        <button className="bg-blue-600 px-6 py-2 rounded-full text-white justify-self-end">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditAccount;
