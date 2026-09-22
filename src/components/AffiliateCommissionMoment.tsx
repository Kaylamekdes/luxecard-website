import { useReducedMotion } from '../hooks/useReducedMotion';
import { RevealSection } from './RevealSection';

function CommissionSpotlight() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return <div aria-hidden="true" className="commission-spotlight pointer-events-none" />;
}

export function AffiliateCommissionMoment() {
  return (
    <RevealSection className="relative overflow-hidden bg-ivory px-[clamp(20px,4vw,48px)] py-[clamp(100px,16vh,190px)] text-center text-ink">
      <div className="relative mx-auto max-w-[1000px]">
        <h2 className="m-0 font-manrope text-[clamp(40px,7vw,96px)] font-extrabold leading-[.97] tracking-[-.035em]">
          REFER. SHARE.
          <br />
          <span className="text-accent">EARN</span> 10%.
        </h2>
        <p className="m-0 mt-[26px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[rgba(11,11,13,.62)]">
          On every order placed through your link.
        </p>
      </div>

      <CommissionSpotlight />
    </RevealSection>
  );
}
