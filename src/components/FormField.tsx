import type { ReactNode } from 'react';

export function Field({
  label,
  required,
  invalid,
  errorText,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  invalid?: boolean;
  // Replaces the generic "This field is required." when the field is invalid.
  errorText?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-inter text-[11px] font-medium tracking-[.1em] text-grey-1">
        {label.toUpperCase()}
        {required && <span className={invalid ? 'text-[#F87171]' : 'text-accent'}> *</span>}
      </span>
      {children}
      {invalid && <span className="text-[12.5px] text-[#F87171]">{errorText ?? 'This field is required.'}</span>}
      {hint && !invalid && <span className="text-[12.5px] text-[rgba(243,240,234,.4)]">{hint}</span>}
    </label>
  );
}
