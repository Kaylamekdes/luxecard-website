import { CARD_FINISHES } from '../data/content';
import { useCreateCardModal } from '../context/createCardModalContext';
import { useAutoCycle } from '../hooks/useAutoCycle';
import { RevealSection } from './RevealSection';

export function Ecosystem() {
  const { open: openCreateCardModal } = useCreateCardModal();
  const { index, cardIn, priceIn, exitMs, enterMs, priceMs, onCardTransitionEnd } = useAutoCycle(CARD_FINISHES.length);
  const finish = CARD_FINISHES[index];
  const cardDurationMs = cardIn ? enterMs : exitMs;
  const cardStyle = {
    opacity: cardIn ? 1 : 0,
    transform: cardIn ? 'translateX(0)' : 'translateX(-24px)',
    transition: `opacity ${cardDurationMs}ms cubic-bezier(.16,1,.3,1), transform ${cardDurationMs}ms cubic-bezier(.16,1,.3,1)`,
  };
  const priceStyle = {
    opacity: priceIn ? 1 : 0,
    transform: priceIn ? 'translateX(0)' : 'translateX(-14px)',
    transition: `opacity ${priceMs}ms cubic-bezier(.16,1,.3,1), transform ${priceMs}ms cubic-bezier(.16,1,.3,1)`,
  };

  return (
    <RevealSection
      id="products"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-[1320px]">
        <h2 className="m-0 mb-[clamp(44px,6vh,72px)] font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
          CRAFTED TO
          <br />
          IMPRESS.
        </h2>

        <div
          className="group relative mx-auto flex min-h-[clamp(400px,52vh,560px)] w-full max-w-[640px] flex-col justify-between overflow-hidden rounded-[20px] border border-[rgba(255,255,255,.08)] p-[clamp(28px,3vw,44px)] transition-colors duration-500 hover:border-[rgba(253,211,3,.34)] md:mx-0"
          style={{ background: 'radial-gradient(110% 80% at 70% 20%, #17171B, #0B0B0D 65%)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">Three Finishes. One Card.</div>
              <h3
                className="mt-3 flex min-h-[2.3em] items-end font-manrope text-[clamp(24px,2.6vw,32px)] font-semibold leading-[.96] tracking-[-.03em]"
                style={cardStyle}
              >
                {finish.name}
              </h3>
              <div className="mt-2 font-inter text-[15px] font-semibold tracking-[.02em] text-accent" style={priceStyle}>
                {finish.price}
              </div>
            </div>
            <span className="shrink-0 whitespace-nowrap font-inter text-[10px] font-medium tracking-[.13em] text-grey-1">
              NFC + QR
            </span>
          </div>
          <div
            className="flex flex-1 items-center justify-center py-6"
            style={cardStyle}
            onTransitionEnd={(e) => {
              if (e.propertyName === 'opacity') onCardTransitionEnd();
            }}
          >
            <img
              src={finish.image}
              alt={finish.alt}
              width={finish.width}
              height={finish.height}
              className="animate-lc-float max-h-[168px] w-auto max-w-[74%] rounded-lg sm:max-h-[240px] sm:max-w-[78%] sm:rounded-2xl"
              style={{ boxShadow: '0 50px 90px -40px rgba(0,0,0,.95)' }}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={openCreateCardModal}
              className="inline-flex items-center gap-2.5 text-[14.5px] text-ivory opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            >
              Create your LuxeCard <span className="font-inter">→</span>
            </button>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
