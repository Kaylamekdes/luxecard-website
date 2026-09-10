import { RevealSection } from './RevealSection';

export function NetworkingMoment() {
  return (
    <RevealSection
      className="relative flex min-h-[clamp(340px,52vh,520px)] items-end border-t border-[rgba(255,255,255,.06)]"
      style={{ background: 'repeating-linear-gradient(45deg, #131318 0 18px, #0E0E12 18px 36px)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,8,10,1) 0%, rgba(8,8,10,.82) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -left-[12%] top-[-20%] aspect-square w-[55%] animate-lc-glow rounded-full blur-[90px]"
        style={{ background: 'radial-gradient(circle, rgba(253,211,3,.4), transparent 70%)', mixBlendMode: 'screen' }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-[10%] bottom-[-25%] aspect-square w-[48%] animate-lc-glow rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(243,240,234,.22), transparent 70%)',
          mixBlendMode: 'screen',
          animationDelay: '2.4s',
        }}
      />
      <div className="relative mx-auto w-full max-w-[1320px] px-[clamp(20px,4vw,48px)] pb-[clamp(56px,8vh,96px)]">
        <h2 className="m-0 mb-6 font-manrope text-[clamp(38px,6.4vw,88px)] font-extrabold leading-[.98] tracking-[-.035em]">
          MEET ONCE.
          <br />
          STAY CONNECTED.
        </h2>
        <p className="m-0 max-w-[480px] text-[clamp(15.5px,1.3vw,18px)] leading-[1.6] text-[rgba(243,240,234,.6)]">
          Turn real-world introductions into digital connections that don’t disappear when the event ends.
        </p>
      </div>
    </RevealSection>
  );
}
