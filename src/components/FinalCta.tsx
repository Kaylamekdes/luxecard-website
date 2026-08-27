import { LINKS } from '../data/links';
import { RevealSection } from './RevealSection';

const CTA_LABEL = 'Get Your LuxeCard';

export function FinalCta() {
  return (
    <RevealSection
      id="get"
      className="relative scroll-mt-[84px] overflow-hidden border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(100px,16vh,190px)] text-center min-[900px]:scroll-mt-[96px]"
      style={{ background: 'radial-gradient(100% 80% at 50% 100%, #1A1915 0%, #0B0B0D 55%, #08080A 100%)' }}
    >
      <div className="mx-auto flex max-w-[1000px] flex-col items-center">
        <h2 className="m-0 mb-[26px] font-manrope text-[clamp(40px,7vw,96px)] font-extrabold leading-[.97] tracking-[-.035em]">
          MAKE YOUR NEXT
          <br />
          INTRODUCTION
          <br />
          <span className="text-accent">UNFORGETTABLE.</span>
        </h2>
        <p className="m-0 mb-[42px] text-[clamp(16px,1.3vw,19px)] text-[rgba(243,240,234,.55)]">
          Your name. Your story. Your world. One tap away.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3.5">
          <a
            href={LINKS.ORDER}
            className="inline-flex items-center gap-2.5 rounded-full border-0 bg-ivory px-[34px] py-[18px] text-base font-semibold text-bg transition-transform duration-[.4s] ease-lux hover:-translate-y-[3px]"
            style={{ boxShadow: '0 20px 50px -22px rgba(243,240,234,.55)' }}
          >
            {CTA_LABEL} <span className="font-inter">→</span>
          </a>
          <a
            href={LINKS.BUSINESS}
            className="border-b border-[rgba(255,255,255,.14)] pb-[3px] text-[15.5px] text-[rgba(243,240,234,.7)]"
          >
            For Business →
          </a>
        </div>
      </div>
    </RevealSection>
  );
}
