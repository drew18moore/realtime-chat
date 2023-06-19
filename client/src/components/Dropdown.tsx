import React, { useRef, useState, useLayoutEffect, ReactNode, FC } from "react";

interface DropdownItemProps {
  icon?: ReactNode;
  onClick: () => void;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
  variant?: "danger";
}

export const DropdownItem: FC<DropdownItemProps> = ({
  icon,
  onClick,
  setShowDropdown,
  children,
  variant,
}) => {
  return (
    <li
      onClick={() => {
        onClick();
        setShowDropdown(false);
      }}
      className={`flex gap-3 items-center px-3 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-900 cursor-pointer ${
        variant === "danger"
          ? `text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-600 dark:text-white dark:hover:bg-red-500`
          : ""
      }`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </li>
  );
};

interface DropdownProps {
  children: ReactNode;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
  orientation?: "horizontal" | "vertical";
}

const Dropdown: FC<DropdownProps> = ({
  children,
  setShowDropdown,
  toggleBtnRef,
  orientation = "vertical",
}) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownPositioning, setDropdownPositioning] = useState<string>("");

  useLayoutEffect(() => {
    setDropdownPositioning(() => {
      let positioning: string = "";

      const rect = dropdownRef.current!.getBoundingClientRect();
      // Prevent dropdown from overflowing over y
      if (rect.bottom > window.innerHeight - 80 - 36 - 8) {
        positioning += "bottom-full top-auto ";
      } else {
        positioning += "top-full ";
      }

      // Prevent dropdown from overflowing over x
      if (rect.right > window.innerWidth - 15) {
        positioning += "right-0";
      }
      return positioning;
    });

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
        !dropdownRef.current.contains(e.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target as Node)
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
        className={`${
          orientation === "horizontal"
            ? "flex"
            : orientation === "vertical"
            ? "flex flex-col"
            : ""
        } absolute ${dropdownPositioning} z-50 bg-white dark:bg-black dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden`}
      >
        {children}
      </ul>
    </>
  );
};

export default Dropdown;
