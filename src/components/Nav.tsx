import { useCallback, useEffect, useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { NAV_LINKS } from '../data/content';
import { useContactModal } from '../context/contactModalContext';
import { useInquiryModal } from '../context/inquiryModalContext';
import { useCart } from '../context/cartContext';
import { useNavMenu } from '../context/navMenuContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { resolveNavHref } from '../utils/navHref';

export function Nav() {
  const { isOpen: menuOpen, toggle: toggleMenu, close: closeMenu } = useNavMenu();
  const wide = useMediaQuery('(min-width: 900px)');
  const { open: openInquiryModal } = useInquiryModal();
  const { open: openContactModal } = useContactModal();
  const { open: openCart, totalCount, isOpen: cartOpen } = useCart();

  useEffect(() => {
    if (wide) closeMenu();
  }, [wide, closeMenu]);

  // The bar's contents (logo, links, buttons) stay hidden until the logo is
  // decoded, then fade in together on the hero text's curve and delay, so the
  // logo never pops in after the rest of the nav. The logo is preloaded from
  // index.html, so this is normally immediate; the timeout means a slow or
  // failed logo can never hold the nav back for long.
  const reduced = useReducedMotion();
  const logoRef = useRef<HTMLImageElement>(null);
  const [logoReady, setLogoReady] = useState(false);
  const markLogoReady = useCallback(() => setLogoReady(true), []);
  useEffect(() => {
    const img = logoRef.current;
    if (img?.complete) img.decode().then(markLogoReady, markLogoReady);
    const fallback = window.setTimeout(markLogoReady, 1500);
    return () => window.clearTimeout(fallback);
  }, [markLogoReady]);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[90]"
      style={{
        background: 'rgba(8,8,10,.82)',
        backdropFilter: 'blur(18px) saturate(140%)',
        filter: cartOpen ? 'blur(18px)' : 'none',
      }}
    >
      <div
        className={
          wide
            ? 'mx-auto grid h-[var(--nav-h)] max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-[clamp(20px,4vw,48px)]'
            : 'mx-auto flex h-[var(--nav-h)] max-w-[1320px] items-center justify-between gap-6 px-[clamp(20px,4vw,48px)]'
        }
        style={{
          opacity: logoReady ? 1 : 0,
          transition: reduced ? 'none' : 'opacity 1.1s 80ms cubic-bezier(.16,1,.3,1)',
        }}
      >
        <a href={resolveNavHref('#top')} className="flex items-center">
          <img
            ref={logoRef}
            onLoad={(e) => e.currentTarget.decode().then(markLogoReady, markLogoReady)}
            onError={markLogoReady}
            fetchPriority="high"
            src="/images/luxecard-logo.webp"
            alt="LuxeCard"
            width={748}
            height={140}
            className="h-7 w-auto sm:h-8"
          />
        </a>

        {wide ? (
          <>
            <div className="flex items-center justify-self-center gap-[clamp(20px,3vw,40px)] text-sm text-[rgba(243,240,234,.68)]">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={resolveNavHref(link.href)} className="hover:text-accent">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center justify-self-end gap-3">
              <CartButton onClick={openCart} count={totalCount} />
              <button
                type="button"
                onClick={() => openInquiryModal('individual')}
                className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-[11px] text-[13.5px] font-semibold tracking-[.01em] text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
              >
                Order Your LuxeCard
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <CartButton onClick={openCart} count={totalCount} />
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="rounded-full border border-[rgba(255,255,255,.16)] px-4 py-[9px] font-inter text-[11px] font-medium tracking-[.13em] text-ivory"
            >
              {menuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        )}
      </div>

      {!wide && (
        <div
          aria-hidden={!menuOpen}
          className="grid transition-[grid-template-rows] duration-[620ms]"
          style={{
            gridTemplateRows: menuOpen ? '1fr' : '0fr',
            pointerEvents: menuOpen ? 'auto' : 'none',
            transitionTimingFunction: 'cubic-bezier(.65,0,.35,1)',
          }}
        >
          <div className="overflow-hidden">
            <div
              className="flex flex-col gap-[18px] border-t border-[rgba(255,255,255,.08)] px-[clamp(20px,5vw,48px)] pb-7 pt-[18px] transition-[opacity,transform]"
              style={{
                background: '#08080A',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(-12px)',
                transitionDuration: '520ms',
                transitionTimingFunction: 'cubic-bezier(.65,0,.35,1)',
                transitionDelay: menuOpen ? '100ms' : '0ms',
              }}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={resolveNavHref(link.href)}
                  onClick={closeMenu}
                  className="font-manrope text-[22px]"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openContactModal();
                }}
                className="text-left font-manrope text-[22px]"
              >
                Contact Us
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openInquiryModal('individual');
                }}
                className="mt-1.5 rounded-full bg-ivory py-[15px] text-center font-semibold text-ink"
              >
                Order Your LuxeCard
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function CartButton({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open cart${count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,.16)] text-ivory transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      <ShoppingCart size={18} strokeWidth={1.6} aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 font-inter text-[10px] font-semibold text-ink"
        >
          {count}
        </span>
      )}
    </button>
  );
}
