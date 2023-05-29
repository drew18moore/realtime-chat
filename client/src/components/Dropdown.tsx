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
  );
};

interface DropdownProps {
  children: ReactNode;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dropdown: FC<DropdownProps> = ({ children, setShowDropdown }) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownPositioning, setDropdownPositioning] = useState<string>("");

  useLayoutEffect(() => {
    // Prevent dropdown from overflowing over y
    const rect = dropdownRef.current!.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 80) {
      setDropdownPositioning("bottom-full top-auto");
    } else {
      setDropdownPositioning("top-full");
    }

    // Close dropdown on click outside
    let initialClickInside = false;
    const handleMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node))
        initialClickInside = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (
        !initialClickInside &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setShowDropdown(false);
      initialClickInside = false;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setShowDropdown]);

  return (
    <>
      <ul
        ref={dropdownRef}
        className={`absolute top-full ${dropdownPositioning} z-50 bg-white border rounded-xl overflow-hidden`}
      >
        {children}
      </ul>
    </>
  );
};

export default Dropdown;
