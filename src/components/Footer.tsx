import { FOOTER_LINKS } from '../data/content';
import { LINKS } from '../data/links';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,.07)] bg-bg px-[clamp(20px,4vw,48px)] pb-10 pt-[clamp(56px,8vh,88px)]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-10">
        <div>
          <div className="flex items-baseline gap-2 font-manrope text-xl font-semibold tracking-[-.02em]">
            LuxeCard
            <span className="font-inter text-[9px] font-semibold tracking-[.13em] text-grey-1 -translate-y-[7px]">
              AFRICA
            </span>
          </div>
          <div className="mt-[18px] font-inter text-[10px] font-medium tracking-[.15em] text-accent">
            ONE TAP. EVERYTHING YOU.
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
        </div>
      </div>
      <div className="mx-auto mt-[clamp(40px,6vh,64px)] flex max-w-[1320px] flex-wrap justify-between gap-x-7 gap-y-4 border-t border-[rgba(255,255,255,.06)] pt-[22px] font-inter text-[10px] tracking-[.14em] text-grey-1">
        <span>© 2026 LUXECARD AFRICA</span>
        <span className="flex gap-6">
          <a href={LINKS.LEGAL.privacy} className="hover:text-accent">
            PRIVACY
          </a>
          <a href={LINKS.LEGAL.terms} className="hover:text-accent">
            TERMS
          </a>
        </span>
      </div>
    </footer>
  );
}
