import React from 'react';

interface BrandMarkProps {
  className?: string;
  showWordmark?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  className = '',
  showWordmark = true,
}) => {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="8"
          fill="#111411"
          stroke="rgba(197, 255, 98, 0.34)"
          strokeWidth="1.25"
        />
        <path
          d="M8.5 18.5L13.25 13.75L16.25 16.75L20.5 10"
          stroke="#C5FF62"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.5 10H20.5V14"
          stroke="#00FF78"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="text-[15px] font-bold tracking-[0.08em] text-[#F5F7F2] whitespace-nowrap shrink-0">
          TRCK MAIN
        </span>
      )}
    </span>
  );
};
