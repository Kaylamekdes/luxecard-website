import { RevealSection } from './RevealSection';

export function AffiliateCommissionMoment() {
  return (
    <RevealSection
      className="relative overflow-hidden border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(100px,16vh,190px)] text-center"
      style={{ background: 'radial-gradient(100% 80% at 50% 100%, #1A1915 0%, #0B0B0D 55%, #08080A 100%)' }}
    >
      <div className="relative mx-auto max-w-[1000px]">
        <h2 className="m-0 font-manrope text-[clamp(40px,7vw,96px)] font-extrabold leading-[.97] tracking-[-.035em]">
          REFER. SHARE.
          <br />
          EARN <span className="text-accent">10%.</span>
        </h2>
        <p className="m-0 mt-[26px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[rgba(243,240,234,.55)]">
          On every order placed through your link.
        </p>
      </div>
    </RevealSection>
  );
}
