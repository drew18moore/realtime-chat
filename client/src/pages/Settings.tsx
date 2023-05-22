import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import EditAccount from "../components/EditAccount";

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
            <EditAccount />
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
