import { useRef } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin";
import { RotatingLines } from "react-loader-spinner";

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
    <div className="flex justify-center items-center h-[calc(100svh)] bg-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-96 p-6 rounded-lg grid shadow-md"
      >
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
            <label
              htmlFor="username"
              className="sr-only"
            >
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600"
              required
              placeholder="Username"
            />
          </div>
          <div className="grid gap-1">
            <label
              htmlFor="password"
              className="sr-only"
            >
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600"
              required
              placeholder="Password"
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

        <p className="text-center mt-2">
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
