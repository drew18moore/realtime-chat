import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100svh)] dark:bg-black">
      <div className="flex items-center gap-3 h-14 px-5 bg-transparent border border-b-neutral-200 border-x-0 border-t-0 dark:border-b-neutral-800">
        <button
          className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 dark:text-white dark:hover:bg-neutral-800"
          onClick={() => navigate(-1)}
        >
          <BiArrowBack size={"100%"} />
        </button>
        <h1 className="text-2xl dark:text-white">Settings</h1>
      </div>
      <div
        className="overflow-y-auto"
        style={{ height: "calc(100svh - 3.5rem)" }}
      >
        <div className="grid gap-2 px-5 max-w-2xl mx-auto">
          <div className="flex flex-col gap-4 mt-6">
            <h2 className="text-blue-600 font-bold">Account</h2>
            <h3>Profile</h3>
            <form className="grid gap-5">
              <div className="flex flex-col">
                <label htmlFor="display-name" className="sr-only">Display Name</label>
                <input
                  type="text"
                  id="display-name"
                  className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white"
                  placeholder="Display Name"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  type="text"
                  id="username"
                  className="px-4 py-2 rounded-full bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white"
                  placeholder="Username"
                />
              </div>
              <button className="bg-blue-600 px-6 py-2 rounded-full text-white flex justify-center justify-self-end">
                Save
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <h2 className="text-blue-600 font-bold">General</h2>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
