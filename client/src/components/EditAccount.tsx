import { FormEvent, useEffect, useRef, useState } from "react";
import { useEditAccount } from "../hooks/auth/useEditAccount";
import Resizer from "react-image-file-resizer";
import { useAuth } from "../contexts/AuthContext";

const EditAccount = () => {
  const {
    mutate: editAccount,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useEditAccount();
  const { currentUser } = useAuth();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [profileImgBase64, setProfileImgBase64] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const display_name = displayNameRef?.current?.value.trim() as string;
    const username = usernameRef?.current?.value.trim().toLowerCase() as string;
    const profile_picture = profileImgBase64 as string;
    console.log(display_name, username);
    editAccount({ display_name, username, profile_picture });
  };

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Resize img
      Resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        80,
        0,
        (uri) => {
          setProfileImgBase64(uri as string);
        },
        "base64"
      );
    } else {
      setProfileImgBase64(null);
    }
  };

  useEffect(() => {
    console.log(profileImgBase64);
  }, [profileImgBase64]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="dark:text-white">Profile</h3>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          className="w-fit"
        />
        <div className="w-24 aspect-square rounded-full overflow-hidden">
          <img
            src={profileImgBase64 || currentUser?.profile_picture || "default-pfp.jpg"}
            alt="uploaded image"
            className="object-cover w-full h-full"
          />
        </div>

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
