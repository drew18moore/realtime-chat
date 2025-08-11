import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const NewGroup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            name="back"
            className="hover:bg-neutral-200 h-11 aspect-square flex items-center justify-center rounded-full p-2.5 dark:text-white dark:hover:bg-neutral-800"
            aria-label="Back"
          >
            <BiArrowBack size={"1.5rem"} />
          </button>
          <h1 className="text-xl font-bold dark:text-white">New Group</h1>
        </div>
      </div>
      <div className="absolute top-14 left-0 right-0 bottom-0 p-2 flex flex-col justify-between"></div>
    </>
  );
};

export default NewGroup;
