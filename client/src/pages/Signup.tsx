import { Link } from "react-router-dom";
import { useRef } from "react";
import useSignup from "../hooks/auth/useSignup";

const Signup = ({}) => {
  const { mutate: signup } = useSignup();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const display_name = displayNameRef?.current?.value.trim() as string;
    const username = usernameRef?.current?.value.trim().toLowerCase() as string;
    const password = passwordRef?.current?.value as string;
    signup({ display_name, username, password });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-96 p-8 rounded-lg grid shadow-md"
      >
        <h1 className="text-2xl text-center font-bold p-2 text-blue-600">
          Sign Up
        </h1>
        <div className="grid gap-1">
          <label
            htmlFor="display-name"
            className="text-lg font-semibold text-blue-600"
          >
            Display Name
          </label>
          <input
            ref={displayNameRef}
            type="text"
            id="display-name"
            className="border border-neutral-300 px-3 py-2 rounded-lg"
            required
          />
        </div>
        <br />
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
        <div className="grid gap-1">
          <label
            htmlFor="repeat-password"
            className="text-lg font-semibold text-blue-600"
          >
            Repeat Password
          </label>
          <input
            ref={repeatPasswordRef}
            type="password"
            id="repeat-password"
            className="border border-neutral-300 px-3 py-2 rounded-lg"
            required
          />
        </div>
        <br />
        <button className="bg-blue-600 p-2 rounded-lg text-white">
          Sign Up
        </button>
        <p className="text-center mt-2">
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
