import { useTheme } from "../contexts/ThemeContext";
import Input from "./ui/Input";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="dark:text-white">Choose theme</h3>
      <div className="flex gap-5 justify-around dark:text-white flex-wrap">
        <div className="w-40 flex flex-col gap-2">
          <div
            onClick={() => {
              setTheme("light");
            }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden cursor-pointer"
          >
            <img src="theme-lightmode.svg" alt="" className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="radio"
              onChange={(e) => setTheme(e.target.value)}
              id="lightmode"
              value="light"
              checked={theme === "light"}
            />
            <label htmlFor="lightmode" className="cursor-pointer text-black dark:text-white">
              Light
            </label>
          </div>
        </div>
        <div className="w-40 flex flex-col gap-2">
          <div
            onClick={() => {
              setTheme("dark");
            }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden cursor-pointer"
          >
            <img src="theme-darkmode.svg" alt="" className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="radio"
              onChange={(e) => setTheme(e.target.value)}
              id="darkmode"
              value="dark"
              checked={theme === "dark"}
            />
            <label htmlFor="darkmode" className="cursor-pointer text-black dark:text-white">
              Dark
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
