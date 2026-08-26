import { RevealSection } from './RevealSection';

export function NetworkingMoment() {
  return (
    <RevealSection
      role="img"
      aria-label="Two professionals shaking hands at an evening rooftop event, exchanging a LuxeCard, city skyline behind them"
      className="relative flex min-h-[clamp(460px,72vh,720px)] items-end border-t border-[rgba(255,255,255,.06)] bg-cover"
      style={{
        backgroundImage: "url('/images/handshake-into-tap.webp')",
        backgroundPosition: 'center 55%',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,8,10,.96) 8%, rgba(8,8,10,.5) 55%, rgba(8,8,10,.75) 100%)',
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
