import React, { forwardRef } from "react";
import { FC } from "react";

interface InputProps {
  type: "text" | "password" | "file" | "radio";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  id?: string;
  required?: boolean;
  accept?: string;
  className?: string;
  checked?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      size = "md",
      placeholder,
      value,
      onChange,
      id,
      required = false,
      accept,
      className,
      checked,
    },
    ref
  ) => {
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
            className={`${className} w-full rounded-full px-4 ${sizeStyles} bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            id={id}
            ref={ref}
            required={required}
          />
        );
        break;
      case "password":
        content = (
          <input
            type="password"
            className={`${className} w-full rounded-full px-4 ${sizeStyles} bg-neutral-200 placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:text-white`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            id={id}
            ref={ref}
            required={required}
          />
        );
        break;
      case "file":
        content = (
          <input
            type="file"
            accept={accept}
            onChange={onChange}
            className={`${className} hidden`}
            id={id}
          />
        );
        break;
      case "radio":
        content = (
          <input
            type="radio"
            className={`${className} accent-blue-600 w-5 h-5 cursor-pointer`}
            onChange={onChange}
            id={id}
            value={value}
            checked={checked}
          />
        );
        break;
      default:
        break;
    }

    return content;
  }
);
export default Input;
