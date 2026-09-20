import { useState } from 'react';

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.q} className="border-b border-[rgba(255,255,255,.09)] last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenIndex((v) => (v === i ? -1 : i))}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-5 py-[26px] text-left font-manrope text-[clamp(17px,1.9vw,23px)] tracking-[-.02em] transition-colors duration-300 hover:text-accent"
            >
              <span>{faq.q}</span>
              <span
                className="font-inter text-[15px] text-grey-1 transition-transform duration-[.45s] ease-lux"
                style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden"
              style={{
                maxHeight: open ? '320px' : '0px',
                opacity: open ? 1 : 0,
                transition: 'max-height .55s cubic-bezier(.16,1,.3,1), opacity .45s ease',
              }}
            >
              <p className="m-0 max-w-[640px] px-1 pb-7 text-[16.5px] leading-[1.65] text-[rgba(243,240,234,.55)]">
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
