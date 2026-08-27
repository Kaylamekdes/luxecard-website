import { HERO_TRUST } from '../data/content';
import { LINKS } from '../data/links';
import { useMountReveal } from '../hooks/useMountReveal';
import { HeroTapVisual } from './HeroTapVisual';

export function Hero() {
  const textStyle = useMountReveal(80);
  const visualStyle = useMountReveal(280);

  return (
    <section
      id="top"
      className="relative px-[clamp(20px,4vw,48px)] pb-[clamp(64px,9vh,120px)] pt-[clamp(36px,calc(15vh-84px),96px)]"
      style={{ background: 'radial-gradient(120% 90% at 78% 10%, #16161A 0%, #0B0B0D 46%, #08080A 100%)' }}
    >
      <div
        className="mx-auto grid max-w-[1320px] items-center gap-[clamp(48px,6vw,80px)]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}
      >
        <div style={textStyle}>
          <div className="mb-[30px] inline-flex items-center gap-[10px] font-inter text-[10.5px] font-medium tracking-[.14em] text-grey-1">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" />
            ONE TAP. EVERYTHING YOU.
          </div>

          <h1
            className="m-0 mb-7 font-manrope text-[clamp(46px,7.6vw,100px)] font-extrabold leading-[.96] tracking-[-0.035em] text-balance"
          >
            YOUR INTRODUCTION,
            <br />
            <span className="text-accent">UPGRADED.</span>
          </h1>

          <p className="m-0 mb-10 max-w-[460px] text-[clamp(16px,1.35vw,19px)] leading-[1.55] text-[rgba(243,240,234,.6)] text-pretty">
            One tap connects people to your contact, socials, portfolio, business and more.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
            <a
              href={LINKS.ORDER}
              className="inline-flex items-center gap-2.5 rounded-full bg-ivory px-[30px] py-[17px] text-[15.5px] font-semibold text-bg transition-[transform,box-shadow] duration-[.4s] ease-lux hover:-translate-y-[3px]"
              style={{ boxShadow: '0 18px 44px -22px rgba(243,240,234,.6)' }}
            >
              Get Your LuxeCard
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-3 border-b border-[rgba(255,255,255,.14)] py-[15px] text-[15.5px] text-[rgba(243,240,234,.78)] transition-colors duration-300 hover:border-accent hover:text-ivory"
            >
              See How It Works <span className="font-inter">→</span>
            </a>
          </div>

          <div className="mt-[clamp(44px,6vh,72px)] flex flex-wrap gap-x-7 gap-y-2.5 font-inter text-[10.5px] font-medium tracking-[.15em] text-grey-1">
            {HERO_TRUST.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div style={visualStyle}>
          <HeroTapVisual />
        </div>
      </div>
    </section>
  );
}
