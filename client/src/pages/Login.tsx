import { useRef } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin";

const Login = () => {
  const { mutate: login, isLoading, isError, error } = useLogin()

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef?.current?.value.trim().toLowerCase() as string
    const password = passwordRef?.current?.value as string
    login({ username, password })
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-96 p-6 rounded-lg grid shadow-md"
      >
        <h1 className="text-2xl text-center font-bold p-2 text-blue-600">
          Log in
        </h1>
        <div className="grid gap-1">
          <label
            htmlFor="username"
            className="text-lg font-semibold text-blue-600"
          >
            Username
          </label>
          <input
            ref={usernameRef}
            type="text"
            id="username"
            className="border border-neutral-300 px-3 py-2 rounded-lg"
            required
          />
        </div>
        <br />
        <div className="grid gap-1">
          <label
            htmlFor="password"
            className="text-lg font-semibold text-blue-600"
          >
            Password
          </label>
          <input
            ref={passwordRef}
            type="password"
            id="password"
            className="border border-neutral-300 px-3 py-2 rounded-lg"
            required
          />
        </div>
        <br />
        <button className="bg-blue-600 p-2 rounded-lg text-white">
          Log In
        </button>
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
