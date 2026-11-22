import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  titleId?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  description,
  align = 'left',
  className = '',
  titleId,
}) => {
  const alignClass =
    align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-2xl ${alignClass} ${className}`}>
      {kicker && (
        <p className="text-xs font-semibold tracking-[0.14em] text-[#C5FF62] mb-3.5">
          {kicker}
        </p>
      )}
      <h2
        id={titleId}
        className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold tracking-[-0.025em] leading-[1.15] text-[#F5F7F2] [text-wrap:balance]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-[17px] leading-[1.65] text-[#A1A69E] max-w-[60ch]">
          {description}
        </p>
      )}
    </div>
  );
};
