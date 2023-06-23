import { FormEvent, useEffect, useRef, useState } from "react";
import { useEditAccount } from "../hooks/auth/useEditAccount";
import Resizer from "react-image-file-resizer";
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;
import { useAuth } from "../contexts/AuthContext";
import { FaCamera } from "react-icons/fa";
import Input from "./ui/Input";

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
      resizer.imageFileResizer(
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

  const resetForm = () => {
    setProfileImgBase64(null);
    displayNameRef.current!.value = "";
    usernameRef.current!.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="relative w-fit m-auto">
          <div className="w-40 aspect-square rounded-full overflow-hidden">
            <img
              src={
                profileImgBase64 ||
                currentUser?.profile_picture ||
                "default-pfp.jpg"
              }
              alt="uploaded image"
              className="object-cover w-full h-full"
            />
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImgChange}
            id="file"
          />
          <label
            htmlFor="file"
            className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer text-xl"
          >
            <FaCamera />
          </label>
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex-grow">
            <label htmlFor="display-name" className="sr-only">
              Display Name
            </label>
            <Input
              ref={displayNameRef}
              type="text"
              size="md"
              placeholder="Display Name"
              id="display-name"
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              ref={usernameRef}
              type="text"
              size="md"
              placeholder="Username"
              id="username"
            />
          </div>
        </div>

        <div className="justify-self-end flex gap-5">
          <button
            onClick={resetForm}
            className="text-neutral-600 hover:underline"
            type="button"
          >
            Reset
          </button>
          <button className="bg-blue-600 px-6 py-2 rounded-full text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccount;
