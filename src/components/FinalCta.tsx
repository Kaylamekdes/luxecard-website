import { useInquiryModal } from '../context/inquiryModalContext';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

// The site's last nudge before the footer. Opens the same order flow as the
// hero's own button.
export function FinalCta() {
  const { open: openInquiryModal } = useInquiryModal();
  const { ref, style } = useReveal<HTMLDivElement>();

  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(80px,11vh,130px)]">
      <div ref={ref} style={style} className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <h2 className="m-0 mb-9 font-manrope text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-.032em] text-balance">
          READY TO UPGRADE YOUR BUSINESS CARD?
        </h2>
        <button
          type="button"
          onClick={() => openInquiryModal('individual')}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ivory px-[clamp(20px,5vw,34px)] py-[clamp(14px,3.5vw,18px)] text-[clamp(13.5px,3.2vw,16px)] font-semibold text-bg transition-[transform,box-shadow] duration-[.4s] ease-lux hover:-translate-y-[3px]"
          style={{ boxShadow: '0 18px 44px -22px rgba(243,240,234,.6)' }}
        >
          Order Your LuxeCard
        </button>
      </div>
    </RevealSection>
  );
}
