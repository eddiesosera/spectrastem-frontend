import React, { ReactNode } from "react";

interface IButton extends React.HTMLAttributes<HTMLDivElement> {
  children: string | ReactNode;
  type: "fill" | "outline" | "toggle" | "danger";
  widthAuto?: "fit" | "fill" | "";
}

export const Button: React.FC<IButton> = ({
  children,
  type,
  widthAuto = "fit",
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={`flex flex-row items-center justify-center gap-1 p-2 px-3 rounded-lg font-semibold text-sm cursor-pointer
        ${
          type === "fill"
            ? "shadow bg-[#534BAF] hover:bg-[#934BAF] text-white"
            : type === "outline"
            ? "border border-gray-400 bg-white hover:bg-gray-100 shadow"
            : type === "danger" && "bg-red-50 hover:bg-red-200 text-red-600 "
        } 
        ${
          widthAuto === "fill"
            ? "w-fill flex-grow"
            : widthAuto === "fit"
            ? "w-fit"
            : ""
        }
        `}
      style={{ cursor: "pointer" }}
    >
      {children}
    </div>
  );
};
