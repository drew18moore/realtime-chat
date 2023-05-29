import React, { useRef, useState, useLayoutEffect, ReactNode, FC } from "react";

interface DropdownItemProps {
  icon: ReactNode;
  children: ReactNode;
}

export const DropdownItem: FC<DropdownItemProps> = ({ icon, children }) => {
  return (
    <li className="flex gap-3 items-center px-3 py-2 hover:bg-neutral-200 cursor-pointer">
      <span>{icon}</span>
      {children}
    </li>
  )
}

interface DropdownProps {
  children: ReactNode;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
}

const Dropdown: FC<DropdownProps> = ({ children, setShowDropdown, messagesContainerRef }) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownPositioning, setDropdownPositioning] = useState<string>("");

  useLayoutEffect(() => {
    const rect = dropdownRef.current!.getBoundingClientRect();
    console.log("RECT", rect.bottom);
    console.log("WINDOW", window.innerHeight - 80);
    console.log("MSG_CONTAINER", messagesContainerRef.current?.clientHeight);
    if (rect.bottom > window.innerHeight - 80) {
      setDropdownPositioning("bottom-full top-auto")
    } else {
      setDropdownPositioning("top-full")
    }
  }, []);

  return (
    <>
      <ul ref={dropdownRef} className={`absolute top-full ${dropdownPositioning} z-50 bg-white border rounded-xl overflow-hidden`}>
        {children}
      </ul>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => !prev);
        }}
      ></div>
    </>
  );
};

export default Dropdown;
