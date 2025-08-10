import { useRef } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin";
import { RotatingLines } from "react-loader-spinner";
import Input from "../components/ui/Input";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";

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
    <div className="min-h-[calc(100svh)] dark:bg-black bg-gray-50 py-8 sm:py-0 sm:flex sm:justify-center sm:items-center">
      <div className="w-full max-w-md px-4 sm:px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FiUser className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Log in to your account to continue
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
          {isError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error?.response?.data?.message || "An unknown error occurred."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <Input
                  ref={usernameRef}
                  type="text"
                  size="md"
                  id="username"
                  placeholder="Enter your username"
                  required
                  className="pl-9 sm:pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <Input
                  ref={passwordRef}
                  type="password"
                  size="md"
                  id="password"
                  placeholder="Enter your password"
                  required
                  className="pl-9 sm:pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-400 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <RotatingLines strokeColor="white" width="18" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Log in</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
