import React from "react";

interface Props {
  toggleOpen: () => void;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref">
  >;
  children: React.ReactNode;
}

export default function EmbedButton({
  toggleOpen,
  Icon,
  children,
}: Readonly<Props>) {
  return (
    <button
      type="button"
      data-tooltip-target="tooltip-share"
      data-tooltip-placement="left"
      className="flex items-center hover:bg-blue-800 rounded-full p-0 pr-4"
      onClick={toggleOpen}
    >
      <div className="flex justify-center items-center me-2 shadow p-2 bg-blue-600 rounded-full">
        <Icon className="w-7 h-7" />
        <span className="sr-only">{children}</span>
      </div>
      {children}
    </button>
  );
}
