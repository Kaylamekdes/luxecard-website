import { LINKS } from '../data/links';
import { PRODUCTION_TIMEFRAME } from '../data/production';
import { useInquiryModal } from '../context/inquiryModalContext';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

// The gold Chairman's Card floats gently beside the text on desktop; on
// mobile the headline and supporting line come first, then the card, then
// the buttons. The "textAndButtons" wrapper is `display: contents` on
// mobile so its two children (heading block, button row) flatten into the
// same flex list as the image and can be interleaved with it by `order`;
// at the desktop breakpoint it becomes a real column again, stacking
// beside the image as one group.
const SUPPORTING_LINE = `No app needed. Tap, share, done. Ready within ${PRODUCTION_TIMEFRAME} of design approval.`;

export function FinalCta() {
  const { open: openInquiryModal } = useInquiryModal();
  const { ref, style } = useReveal<HTMLDivElement>();

  return (
    <RevealSection className="relative overflow-hidden border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(80px,11vh,130px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(55% 65% at 82% 38%, rgba(253,211,3,.14) 0%, transparent 65%)' }}
      />
      <div
        ref={ref}
        style={style}
        className="relative mx-auto flex max-w-[1120px] flex-col items-center gap-8 text-center min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-16 min-[900px]:text-left"
      >
        <div className="contents min-[900px]:flex min-[900px]:flex-col min-[900px]:items-start min-[900px]:gap-9">
          <div className="order-1">
            <h2 className="m-0 mb-5 max-w-[480px] font-manrope text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-.032em] text-balance">
              READY TO UPGRADE YOUR BUSINESS CARD?
            </h2>
            <p className="m-0 max-w-[420px] text-[15px] leading-[1.6] text-[rgba(243,240,234,.6)]">{SUPPORTING_LINE}</p>
          </div>

          <div className="order-3 flex flex-col items-center gap-4 min-[900px]:items-start sm:flex-row">
            <button
              type="button"
              onClick={() => openInquiryModal('individual')}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ivory px-[clamp(20px,5vw,34px)] py-[clamp(14px,3.5vw,18px)] text-[clamp(13.5px,3.2vw,16px)] font-semibold text-bg transition-[transform,box-shadow] duration-[.4s] ease-lux hover:-translate-y-[3px]"
              style={{ boxShadow: '0 18px 44px -22px rgba(243,240,234,.6)' }}
            >
              Order Your LuxeCard
            </button>
            <a
              href={LINKS.CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 text-[14px] text-[rgba(243,240,234,.7)] underline decoration-[rgba(243,240,234,.3)] underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
            >
              Talk to us on WhatsApp
            </a>
          </div>
        </div>

        <img
          src="/images/card-chairman.webp"
          alt="LuxeCard in Chairman's Card gold finish"
          width={912}
          height={537}
          className="animate-lc-float order-2 w-full max-w-[220px] shrink-0 rounded-2xl min-[900px]:max-w-[380px]"
          style={{ boxShadow: '0 50px 90px -35px rgba(0,0,0,.9)' }}
        />
      </div>
    </RevealSection>
  );
}
