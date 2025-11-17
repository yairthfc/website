import React from "react";

interface YmSignatureLogoProps {
  className?: string;
}

const YmSignatureLogo: React.FC<YmSignatureLogoProps> = ({
  className = "h-9 w-9 text-sky-500",
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeOpacity={0.85}
      />

      {/* Stylized Y */}
      <path
        d="M 8 8 L 14 18 L 14 26"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stylized M */}
      <path
        d="M 19 26 L 19 12 L 23 20 L 27 12 L 27 26"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default YmSignatureLogo;
