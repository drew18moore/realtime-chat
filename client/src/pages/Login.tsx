import { useRef } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin";
import { RotatingLines } from "react-loader-spinner";
import Input from "../components/ui/Input";

const Login = () => {
  const { mutate: login, isLoading, isError, error } = useLogin();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef?.current?.value.trim().toLowerCase() as string;
    const password = passwordRef?.current?.value as string;
    login({ username, password });
  };

  return (
    <div className="flex justify-center items-center h-[calc(100svh)] dark:bg-black">
      <form onSubmit={handleSubmit} className="w-96 p-6 rounded-lg grid gap-2">
        <h1 className="text-2xl text-center font-bold p-2 text-blue-600">
          Log in
        </h1>
        {isError && (
          <p className="bg-red-100 border border-red-600 w-fit text-red-600 m-auto px-2 rounded-lg">
            {error?.response?.data?.message || "An unknown error occurred."}
          </p>
        )}
        <div className="grid gap-5">
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
            <Input
              ref={passwordRef}
              type="password"
              size="md"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <button className="bg-blue-600 p-2 rounded-full text-white flex justify-center">
            {isLoading ? (
              <RotatingLines strokeColor="white" width="24" />
            ) : (
              "Log in"
            )}
          </button>
        </div>

        <p className="text-center mt-2 dark:text-white">
          Need an account?{" "}
          <Link to={"/signup"} className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
