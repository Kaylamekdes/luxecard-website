import { TESTIMONIALS } from '../data/content';
import { useAutoCycle } from '../hooks/useAutoCycle';
import { RevealSection } from './RevealSection';

export function Testimonials() {
  const { index, cardIn, exitMs, enterMs, onCardTransitionEnd } = useAutoCycle(TESTIMONIALS.length);
  const testimonial = TESTIMONIALS[index];
  const durationMs = cardIn ? enterMs : exitMs;
  const quoteStyle = {
    opacity: cardIn ? 1 : 0,
    transform: cardIn ? 'translateY(0) scale(1)' : 'translateY(18px) scale(.97)',
    transition: `opacity ${durationMs}ms cubic-bezier(.16,1,.3,1), transform ${durationMs}ms cubic-bezier(.16,1,.3,1)`,
  };

  return (
    <RevealSection
      id="testimonials"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] text-center min-[900px]:scroll-mt-[96px]"
    >
      <div className="mx-auto max-w-[900px]">
        <h2 className="m-0 mb-[clamp(48px,7vh,88px)] font-manrope text-[clamp(32px,4.4vw,58px)] font-bold leading-[.98] tracking-[-.032em]">
          REAL REVIEWS.
          <br />
          REAL CONNECTIONS.
        </h2>

        <div
          className="mx-auto flex min-h-[clamp(320px,44vh,400px)] max-w-[820px] flex-col items-center justify-center"
          style={quoteStyle}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'opacity') onCardTransitionEnd();
          }}
        >
          <div className="mb-8 flex items-center gap-2 text-accent">
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </div>

          <p className="m-0 font-manrope text-[clamp(24px,3.8vw,44px)] font-semibold leading-[1.24] tracking-[-.02em]">
            “{testimonial.quote}”
          </p>

          <div className="mt-9 font-inter text-[13px] font-medium uppercase tracking-[.14em] text-grey-1">
            {testimonial.name}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M12 .9l3.1 6.6 7.1.9-5.2 5 1.4 7.1L12 17.4l-6.4 3.1L7 13.4 1.8 8.4l7.1-.9L12 .9z" />
    </svg>
  );
}
