import { LINKS } from '../data/links';
import { PRODUCTION_TIMEFRAME } from '../data/production';
import { useInquiryModal } from '../context/inquiryModalContext';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

// DESIGN OPTION B: an open layout with the gold Chairman's Card floating
// beside the text on desktop, stacked above it on mobile, plus an ambient
// glow bleeding from behind the card into the section.
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
        className="relative mx-auto flex max-w-[1120px] flex-col items-center gap-10 text-center min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-16 min-[900px]:text-left"
      >
        <img
          src="/images/card-chairman.webp"
          alt="LuxeCard in Chairman's Card gold finish"
          width={960}
          height={565}
          className="animate-lc-float order-first mt-4 w-full max-w-[300px] shrink-0 rounded-2xl min-[900px]:order-last min-[900px]:mt-0 min-[900px]:max-w-[380px]"
          // `rotate` as its own property (not folded into `transform`) so it
          // survives animate-lc-float, which animates `transform` itself —
          // the two would otherwise fight over the same CSS property and
          // the tilt would disappear whenever the float animation is running.
          style={{ rotate: '-6deg', boxShadow: '0 50px 90px -35px rgba(0,0,0,.9)' }}
        />
        <div className="flex flex-col items-center min-[900px]:items-start">
          <div className="mb-5 font-inter text-[10.5px] font-medium tracking-[.2em] text-accent">
            TRUSTED BY 1000+ PROFESSIONALS
          </div>
          <h2 className="m-0 mb-5 max-w-[480px] font-manrope text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-.032em] text-balance">
            READY TO UPGRADE YOUR BUSINESS CARD?
          </h2>
          <p className="m-0 mb-9 max-w-[420px] text-[15px] leading-[1.6] text-[rgba(243,240,234,.6)]">{SUPPORTING_LINE}</p>
          <div className="flex flex-col items-center gap-4 min-[900px]:items-start sm:flex-row">
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
      </div>
    </RevealSection>
  );
}
