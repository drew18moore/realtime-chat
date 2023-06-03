import React, { forwardRef } from "react";
import { FC } from "react";

interface InputProps {
  type: "text" | "search" | "file" | "radio";
  size: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  id?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type,
  size,
  placeholder,
  value,
  onChange,
  id,
  required = false
}, ref) => {
  let sizeStyles: string;
  switch (size) {
    case "sm":
      sizeStyles = "py-1";
      break;
    case "md":
      sizeStyles = "py-2";
      break;
    case "lg":
      sizeStyles = "py-3";
      break;
    default:
      sizeStyles = "";
      break;
  }

  let content = null;
  switch (type) {
    case "text":
      content = (
        <input
          type="text"
          className={`w-full rounded-full px-4 ${sizeStyles} bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          id={id}
          ref={ref}
          required={required}
        />
      );
      break;
    case "search":
      content = <input type="text" />;
      break;
    case "file":
      content = <input type="file" />;
      break;
    case "radio":
      content = <input type="radio" />;
      break;
    default:
      break;
  }

  return content;
});
export default Input;
