import { Fragment, useState } from 'react';
import { LINKS } from '../data/links';
import { useReveal } from '../hooks/useReveal';

// `group` (optional) prints a small heading above the first question of each
// group. `{contact}` in an answer renders as a "Contact us" WhatsApp link.
export type FaqItem = { q: string; a: string; group?: string };

const CONTACT_TOKEN = '{contact}';

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(CONTACT_TOKEN);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <a
              href={LINKS.CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-[3px] transition-opacity duration-300 hover:opacity-80"
            >
              Contact us
            </a>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

function FaqRow({ faq, open, onToggle, index }: { faq: FaqItem; open: boolean; onToggle: () => void; index: number }) {
  const { ref, style } = useReveal<HTMLDivElement>(index * 70);

  return (
    <div ref={ref} style={style} className="border-b border-[rgba(255,255,255,.09)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
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
          maxHeight: open ? '520px' : '0px',
          opacity: open ? 1 : 0,
          transition: 'max-height .55s cubic-bezier(.16,1,.3,1), opacity .45s ease',
        }}
      >
        <p className="m-0 max-w-[640px] px-1 pb-7 text-[16.5px] leading-[1.65] text-[rgba(243,240,234,.55)]">
          <FaqAnswer text={faq.a} />
        </p>
      </div>
    </div>
  );
}

function FaqGroupHeading({ label, first }: { label: string; first: boolean }) {
  return (
    <h3
      className={`m-0 border-b border-[rgba(255,255,255,.09)] pb-3 font-inter text-[11px] font-medium uppercase tracking-[.16em] text-grey-1 ${
        first ? '' : 'mt-[clamp(40px,6vh,64px)]'
      }`}
    >
      {label}
    </h3>
  );
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        const startsGroup = faq.group !== undefined && faq.group !== faqs[i - 1]?.group;
        return (
          <Fragment key={faq.q}>
            {startsGroup && <FaqGroupHeading label={faq.group!} first={i === 0} />}
            <FaqRow
              faq={faq}
              open={open}
              onToggle={() => setOpenIndex((v) => (v === i ? -1 : i))}
              index={i}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
