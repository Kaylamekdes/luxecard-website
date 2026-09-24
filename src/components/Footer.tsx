import { ArrowUpRight } from 'lucide-react';
import { useContactModal } from '../context/contactModalContext';
import { FOOTER_LINKS } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReveal } from '../hooks/useReveal';
import { resolveNavHref } from '../utils/navHref';

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

function FacebookIcon(props: { size: number; strokeWidth: number; 'aria-hidden'?: boolean | 'true' | 'false' }) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SOCIAL_ICONS: Partial<Record<string, typeof InstagramIcon>> = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  Facebook: FacebookIcon,
};

export function Footer() {
  const { ref, style } = useReveal<HTMLElement>();
  const wide = useMediaQuery('(min-width: 900px)');
  const { open: openContactModal } = useContactModal();

  return (
    <footer
      ref={ref}
      style={style}
      className="border-t border-[rgba(255,255,255,.07)] bg-bg px-[clamp(20px,4vw,48px)] pb-[clamp(56px,8vh,88px)] pt-[clamp(56px,8vh,88px)]"
    >
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-10">
        <div>
          <img
            src="/images/luxecard-logo-tagline.png"
            alt="LuxeCard: Networking Partner"
            width={1144}
            height={374}
            className="h-12 w-auto sm:h-14"
          />
        </div>
        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3">
            <div className="mb-1 font-inter text-[10px] font-medium tracking-[.15em] text-accent">
              {FOOTER_LINKS.columnOne.title.toUpperCase()}
            </div>
            {FOOTER_LINKS.columnOne.links.map((link) => (
              <a
                key={link.href}
                href={resolveNavHref(link.href)}
                className="text-sm text-[rgba(243,240,234,.6)] hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="mb-1 font-inter text-[10px] font-medium tracking-[.15em] text-accent">
              {FOOTER_LINKS.columnTwo.title.toUpperCase()}
            </div>
            {FOOTER_LINKS.columnTwo.links
              .filter((link) => !SOCIAL_ICONS[link.label])
              .map((link) => {
                if (link.label === 'Contact' && !wide) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={openContactModal}
                      className="text-left text-sm text-[rgba(243,240,234,.6)] hover:text-accent"
                    >
                      {link.label}
                    </button>
                  );
                }
                const external = link.href.startsWith('http');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[rgba(243,240,234,.6)] hover:text-accent"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                );
              })}
            <div className="mt-1 flex gap-4">
              {FOOTER_LINKS.columnTwo.links
                .filter((link) => SOCIAL_ICONS[link.label])
                .map((link) => {
                  const Icon = SOCIAL_ICONS[link.label]!;
                  const external = link.href.startsWith('http');
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      className="text-[rgba(243,240,234,.6)] hover:text-accent"
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                    </a>
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="mb-1 font-inter text-[10px] font-medium tracking-[.15em] text-accent">
              {FOOTER_LINKS.columnThree.title.toUpperCase()}
            </div>
            {FOOTER_LINKS.columnThree.links.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-[rgba(243,240,234,.6)] hover:text-accent">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[clamp(40px,6vh,64px)] flex max-w-[1320px] flex-wrap justify-between gap-x-7 gap-y-4 pt-[22px] font-inter text-[10px] tracking-[.14em] text-ivory">
        <span>© 2026 LUXECARD AFRICA</span>
        <span>
          DESIGNED & BUILT BY{' '}
          <a
            href="https://the-company-design-website.vercel.app/?utm_source=luxecard&utm_medium=footer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TheCompany.design (opens in a new tab)"
            // The ::before widens the tap area (the text is only 10px tall)
            // without changing layout.
            className="group relative inline-flex items-center gap-[3px] whitespace-nowrap rounded-[2px] text-accent/80 transition-colors duration-200 before:absolute before:-inset-x-2 before:-inset-y-4 before:content-[''] hover:text-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <span className="underline decoration-1 underline-offset-[3px]">THECOMPANY.DESIGN</span>
            <ArrowUpRight
              aria-hidden="true"
              size={11}
              strokeWidth={1.8}
              className="shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-y-[1.5px] motion-safe:group-hover:translate-x-[1.5px] motion-safe:group-focus-visible:-translate-y-[1.5px] motion-safe:group-focus-visible:translate-x-[1.5px]"
            />
          </a>
        </span>
      </div>
    </footer>
  );
}
