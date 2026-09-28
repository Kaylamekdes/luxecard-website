import { LINKS } from '../data/links';
import { useInquiryModal } from '../context/inquiryModalContext';
import { useReveal } from '../hooks/useReveal';

// A glowing "UPGRADE" replaces the old floating card as the section's
// focal point. The word itself never moves — only the SVG glow filter
// behind it and the two radial light beams animate in, once, as the
// section scrolls into view (via useReveal's `visible` flag, the same
// signal every other section's entrance uses). After that one-shot
// animation settles, the filtered word and the beams are static: nothing
// here keeps re-rendering while the page scrolls past.
export function FinalCta() {
  const { open: openInquiryModal } = useInquiryModal();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="final-cta-heading"
      className={`final-cta relative overflow-hidden border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(80px,11vh,130px)] text-center${visible ? ' is-visible' : ''}`}
    >
      {/* Soft gold light beams, one above and one below the headline */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[18rem] sm:max-w-[44rem]" aria-hidden="true">
        <div className="final-cta-beam-top absolute inset-0 rounded-full" />
        <div className="final-cta-beam-bottom absolute inset-0 rounded-full" />
      </div>

      <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-5">
        <h2
          id="final-cta-heading"
          className="m-0 font-manrope text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-.032em] text-balance"
        >
          READY TO{' '}
          <span className="final-cta-glow relative inline-block" data-text="UPGRADE">
            UPGRADE
          </span>{' '}
          YOUR BUSINESS CARD?
        </h2>

        <p className="m-0 text-[15px] leading-[1.6] text-[rgba(243,240,234,.6)]">Tap to share. No app needed.</p>

        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
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

      {/* Glow filters (decorative). Two variants: a full-strength one for
          desktop, and a lighter-blur one for small screens where the full
          blur radii would read as too heavy relative to the text size. */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="final-cta-glow-mobile" colorInterpolationFilters="sRGB" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur4" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur19" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur9" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur30" />

            {/* Tight warm-white core */}
            <feColorMatrix
              in="blur4"
              result="c0"
              type="matrix"
              values="1 0 0 0 0  0 0.96 0 0 0  0 0 0.88 0 0  0 0 0 0.8 0"
            />
            <feOffset in="c0" result="l0" dx="0" dy="0" />

            {/* Gold halo layers, tinted to the site's accent gold (#FDD303) */}
            <feColorMatrix
              in="blur19"
              result="c1"
              type="matrix"
              values="0.85 0 0 0 0  0 0.703 0 0 0  0 0 0.0102 0 0  0 0 0 1 0"
            />
            <feOffset in="c1" result="l1" dx="0" dy="1" />

            <feColorMatrix
              in="blur9"
              result="c2"
              type="matrix"
              values="1 0 0 0 0  0 0.827 0 0 0  0 0 0.012 0 0  0 0 0 0.65 0"
            />
            <feOffset in="c2" result="l2" dx="0" dy="1" />

            <feColorMatrix
              in="blur30"
              result="c3"
              type="matrix"
              values="1 0 0 0 0  0 0.827 0 0 0  0 0 0.012 0 0  0 0 0 1 0"
            />
            <feOffset in="c3" result="l3" dx="0" dy="1" />

            {/* Deep amber falloff */}
            <feColorMatrix
              in="blur30"
              result="c4"
              type="matrix"
              values="0.5 0 0 0 0  0 0.4135 0 0 0  0 0 0.006 0 0  0 0 0 1 0"
            />
            <feOffset in="c4" result="l4" dx="0" dy="8" />

            <feColorMatrix
              in="blur30"
              result="c5"
              type="matrix"
              values="0.42 0 0 0 0  0 0.347 0 0 0  0 0 0.005 0 0  0 0 0 1 0"
            />
            <feOffset in="c5" result="l5" dx="0" dy="32" />

            <feColorMatrix
              in="blur30"
              result="c6"
              type="matrix"
              values="0.22 0 0 0 0  0 0.182 0 0 0  0 0 0.0026 0 0  0 0 0 1 0"
            />
            <feOffset in="c6" result="l6" dx="0" dy="32" />

            <feColorMatrix in="blur30" result="c7" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.68 0" />
            <feOffset in="c7" result="l7" dx="0" dy="32" />

            <feMerge>
              <feMergeNode in="l0" />
              <feMergeNode in="l1" />
              <feMergeNode in="l2" />
              <feMergeNode in="l3" />
              <feMergeNode in="l4" />
              <feMergeNode in="l5" />
              <feMergeNode in="l6" />
              <feMergeNode in="l7" />
              <feMergeNode in="l0" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="final-cta-glow" colorInterpolationFilters="sRGB" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur4" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="19" result="blur19" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur9" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30" />

            {/* Tight warm-white core */}
            <feColorMatrix
              in="blur4"
              result="c0"
              type="matrix"
              values="1 0 0 0 0  0 0.96 0 0 0  0 0 0.88 0 0  0 0 0 0.8 0"
            />
            <feOffset in="c0" result="l0" dx="0" dy="0" />

            {/* Gold halo layers, tinted to the site's accent gold (#FDD303) */}
            <feColorMatrix
              in="blur19"
              result="c1"
              type="matrix"
              values="0.85 0 0 0 0  0 0.703 0 0 0  0 0 0.0102 0 0  0 0 0 1 0"
            />
            <feOffset in="c1" result="l1" dx="0" dy="2" />

            <feColorMatrix
              in="blur9"
              result="c2"
              type="matrix"
              values="1 0 0 0 0  0 0.827 0 0 0  0 0 0.012 0 0  0 0 0 0.65 0"
            />
            <feOffset in="c2" result="l2" dx="0" dy="2" />

            <feColorMatrix
              in="blur30"
              result="c3"
              type="matrix"
              values="1 0 0 0 0  0 0.827 0 0 0  0 0 0.012 0 0  0 0 0 1 0"
            />
            <feOffset in="c3" result="l3" dx="0" dy="2" />

            {/* Deep amber falloff */}
            <feColorMatrix
              in="blur30"
              result="c4"
              type="matrix"
              values="0.5 0 0 0 0  0 0.4135 0 0 0  0 0 0.006 0 0  0 0 0 1 0"
            />
            <feOffset in="c4" result="l4" dx="0" dy="16" />

            <feColorMatrix
              in="blur30"
              result="c5"
              type="matrix"
              values="0.42 0 0 0 0  0 0.347 0 0 0  0 0 0.005 0 0  0 0 0 1 0"
            />
            <feOffset in="c5" result="l5" dx="0" dy="64" />

            <feColorMatrix
              in="blur30"
              result="c6"
              type="matrix"
              values="0.22 0 0 0 0  0 0.182 0 0 0  0 0 0.0026 0 0  0 0 0 1 0"
            />
            <feOffset in="c6" result="l6" dx="0" dy="64" />

            <feColorMatrix in="blur30" result="c7" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.68 0" />
            <feOffset in="c7" result="l7" dx="0" dy="64" />

            <feMerge>
              <feMergeNode in="l0" />
              <feMergeNode in="l1" />
              <feMergeNode in="l2" />
              <feMergeNode in="l3" />
              <feMergeNode in="l4" />
              <feMergeNode in="l5" />
              <feMergeNode in="l6" />
              <feMergeNode in="l7" />
              <feMergeNode in="l0" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </section>
  );
}
