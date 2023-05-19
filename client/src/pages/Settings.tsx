import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

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
        <div className="grid gap-2 p-2 max-w-2xl mx-auto">
          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-blue-600 font-bold">General</h2>
            <h3 className="dark:text-white">Choose theme</h3>
            <div className="flex gap-5 justify-around dark:text-white flex-wrap">
              <div className="w-40 flex flex-col gap-2">
                <div onClick={() => {setTheme("light")}} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden cursor-pointer">
                  <img src="theme-lightmode.svg" alt="" className="w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-blue-600 w-5 h-5 cursor-pointer"
                    onChange={(e) => setTheme(e.target.value)}
                    id="lightmode"
                    value="light"
                    checked={theme === "light"}
                  />
                  <label htmlFor="lightmode" className="cursor-pointer">Light</label>
                </div>
              </div>
              <div className="w-40 flex flex-col gap-2">
                <div onClick={() => {setTheme("dark")}} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden cursor-pointer">
                  <img src="theme-darkmode.svg" alt="" className="w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-blue-600 w-5 h-5 cursor-pointer"
                    onChange={(e) => setTheme(e.target.value)}
                    id="darkmode"
                    value="dark"
                    checked={theme === "dark"}
                  />
                  <label htmlFor="darkmode" className="cursor-pointer">Dark</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
