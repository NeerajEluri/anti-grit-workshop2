import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textId}
        rows={rows}
        className={twMerge(clsx(
          "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-agri-500 focus:outline-none focus:ring-2 focus:ring-agri-500/20 disabled:bg-slate-50 disabled:text-slate-500 resize-y",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        ))}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
});

TextArea.displayName = 'TextArea';
