import { FOOTER_LINKS } from '../data/content';
import { useReveal } from '../hooks/useReveal';

function InstagramIcon(props: { size: number; strokeWidth: number; 'aria-hidden'?: boolean | 'true' | 'false' }) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props['aria-hidden']}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon(props: { size: number; strokeWidth: number; 'aria-hidden'?: boolean | 'true' | 'false' }) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props['aria-hidden']}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const SOCIAL_ICONS: Partial<Record<string, typeof InstagramIcon>> = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
};

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
            src="/images/luxecard-logo-tagline.png"
            alt="LuxeCard — Networking Partner"
            width={1144}
            height={374}
            className="h-12 w-auto sm:h-14"
          />
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
            {FOOTER_LINKS.columnTwo.map((link) => {
              const external = link.href.startsWith('http');
              const Icon = SOCIAL_ICONS[link.label];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={Icon ? link.label : undefined}
                  className="hover:text-accent"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {Icon ? <Icon size={18} strokeWidth={1.6} aria-hidden="true" /> : link.label}
                </a>
              );
            })}
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
      <div className="mx-auto mt-[clamp(40px,6vh,64px)] flex max-w-[1320px] flex-wrap justify-between gap-x-7 gap-y-4 pt-[22px] font-inter text-[10px] tracking-[.14em] text-ivory">
        <span>© 2026 LUXECARD AFRICA</span>
        <span>DESIGNED & BUILT BY THECOMPANY.DESIGN</span>
      </div>
    </footer>
  );
}
