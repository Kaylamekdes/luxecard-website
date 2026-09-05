import { FOOTER_LINKS } from '../data/content';
import { useReveal } from '../hooks/useReveal';

export function Footer() {
  const { ref, style } = useReveal<HTMLElement>();

  return (
    <footer
      ref={ref}
      style={style}
      className="border-t border-[rgba(255,255,255,.07)] bg-bg px-[clamp(20px,4vw,48px)] pb-[clamp(104px,15vh,130px)] pt-[clamp(56px,8vh,88px)]"
    >
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-10">
        <div>
          <img
            src="/images/luxecard-logo.webp"
            alt="LuxeCard"
            width={748}
            height={140}
            className="h-7 w-auto sm:h-8"
          />
          <div className="mt-[18px] font-inter text-[10px] font-medium tracking-[.15em] text-accent">
            YOUR NETWORKING PARTNER
          </div>
        </div>
        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3 text-sm text-[rgba(243,240,234,.6)]">
            {FOOTER_LINKS.columnOne.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3 text-sm text-[rgba(243,240,234,.6)]">
            {FOOTER_LINKS.columnTwo.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-accent">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3 text-sm text-[rgba(243,240,234,.6)]">
            {FOOTER_LINKS.columnThree.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-accent">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[clamp(40px,6vh,64px)] flex max-w-[1320px] flex-wrap justify-between gap-x-7 gap-y-4 border-t border-[rgba(255,255,255,.06)] pt-[22px] font-inter text-[10px] tracking-[.14em] text-ivory">
        <span>© 2026 LUXECARD AFRICA</span>
        <span>DESIGNED & BUILT BY THECOMPANY.DESIGN</span>
      </div>
    </footer>
  );
}
