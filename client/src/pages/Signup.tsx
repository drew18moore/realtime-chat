import { Link } from "react-router-dom";
import { useRef } from "react";
import useSignup from "../hooks/auth/useSignup";
import { RotatingLines } from "react-loader-spinner";
import Input from "../components/ui/Input";

const Signup = ({}) => {
  const { mutate: signup, isLoading, isError, error } = useSignup();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const display_name = displayNameRef?.current?.value.trim() as string;
    const username = usernameRef?.current?.value.trim().toLowerCase() as string;
    const password = passwordRef?.current?.value as string;
    const repeatPassword = repeatPasswordRef?.current?.value as string;
    signup({ display_name, username, password, repeatPassword });
  };

  return (
    <div className="flex justify-center items-center h-[calc(100svh)] dark:bg-black">
      <form onSubmit={handleSubmit} className="w-96 p-6 rounded-lg grid gap-2">
        <h1 className="text-2xl text-center font-bold p-2 text-blue-600">
          Sign Up
        </h1>
        {isError && (
          <p className="bg-red-100 border border-red-600 w-fit text-red-600 m-auto px-2 rounded-lg">
            {error?.response?.data?.message || "An unknown error occurred."}
          </p>
        )}
        <div className="grid gap-5">
          <div className="grid gap-1">
            <label htmlFor="display-name" className="sr-only">
              Display Name
            </label>
            <Input
              ref={displayNameRef}
              type="text"
              size="md"
              id="display-name"
              placeholder="Display Name"
              required
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              ref={usernameRef}
              type="text"
              size="md"
              id="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white"
              required
              placeholder="Password"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="repeat-password" className="sr-only">
              Repeat Password
            </label>
            <input
              ref={repeatPasswordRef}
              type="password"
              id="repeat-password"
              className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white"
              required
              placeholder="Repeat Password"
            />
          </div>
          <button className="bg-blue-600 p-2 rounded-full text-white flex justify-center">
            {isLoading ? (
              <RotatingLines strokeColor="white" width="24" />
            ) : (
              "Sign up"
            )}
          </button>
        </div>

        <p className="text-center mt-2 dark:text-white">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
