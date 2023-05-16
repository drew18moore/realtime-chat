import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100svh)]">
      <div className="flex items-center gap-3 h-14 px-5 bg-transparent border border-b-neutral-200 border-x-0 border-t-0">
        <button
          className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5"
          onClick={() => navigate(-1)}
        >
          <BiArrowBack size={"100%"} />
        </button>
        <h1 className="text-2xl">Settings</h1>
      </div>
      <div className="overflow-y-auto" style={{ height: "calc(100svh - 3.5rem)" }}>
        <div className="grid gap-2 p-2 max-w-2xl mx-auto">
          
        </div>
      </div>
    </div>
  );
};

export default Settings;
