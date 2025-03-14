import React from "react";

interface SectionDividerProps {
  icon?: "bottle" | "glass" | "leaf" | "drop";
  light?: boolean;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  icon = "bottle",
  light = false,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "bottle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M10 2L8 5" />
            <path d="M14 2L16 5" />
            <path d="M13 16a4 4 0 01-6.3 0" />
            <path d="M8 5v2.5c0 1.5-2.5 2.5-2.5 5 0 1.7.6 3.3 1.9 4.6a6.5 6.5 0 009.2 0c1.3-1.3 1.9-2.9 1.9-4.6 0-2.5-2.5-3.5-2.5-5V5z" />
          </svg>
        );
      case "glass":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M8 21h8" />
            <path d="M12 15v6" />
            <path d="M17 3l-2 9.2a4 4 0 01-6 0L7 3" />
            <path d="M6 3h12" />
          </svg>
        );
      case "leaf":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M2 22l10-10" />
            <path d="M16 8l-8 8" />
            <path d="M22 2l-5.5 5.5" />
            <path d="M18 11l.5-4 4-.5" />
            <path d="M12 16.5V21" />
            <path d="M7 10.5c1.333 1 3.7 3.4 4 4 .3.6 0 4 0 4" />
            <path d="M19.5 4.5L22 2 6 18 2 22" />
          </svg>
        );
      case "drop":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-12">
      <div className="flex items-center justify-center">
        <div
          className={`flex-grow h-px max-w-sm ${
            light ? "bg-white/30" : "bg-primary/30"
          }`}
        ></div>
        <div
          className={`mx-4 p-2 rounded-full ${
            light ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
          }`}
        >
          {renderIcon()}
        </div>
        <div
          className={`flex-grow h-px max-w-sm ${
            light ? "bg-white/30" : "bg-primary/30"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default SectionDivider;
