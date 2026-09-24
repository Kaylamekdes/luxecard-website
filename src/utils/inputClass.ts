export const inputClass = (invalid?: boolean) =>
  `w-full rounded-xl border ${invalid ? 'border-[#F87171]' : 'border-[rgba(255,255,255,.14)]'} bg-[rgba(255,255,255,.03)] px-4 py-3 text-[16px] text-ivory placeholder:text-[rgba(243,240,234,.28)] outline-none transition-colors duration-300 focus:border-accent`;
