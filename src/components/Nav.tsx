import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/content';
import { useCreateCardModal } from '../context/createCardModalContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wide = useMediaQuery('(min-width: 900px)');
  const { open: openCreateCardModal } = useCreateCardModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (wide) setMenuOpen(false);
  }, [wide]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[90] border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-out"
      style={{
        background: scrolled ? 'rgba(8,8,10,.82)' : 'transparent',
        borderColor: scrolled ? 'rgba(255,255,255,.08)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
      }}
    >
      <div className="mx-auto flex h-[84px] max-w-[1320px] items-center justify-between gap-6 px-[clamp(20px,4vw,48px)] min-[900px]:h-[96px]">
        <a href="#top" className="flex items-center">
          <img
            src="/images/luxecard-logo.webp"
            alt="LuxeCard"
            width={748}
            height={140}
            className="h-7 w-auto sm:h-8"
          />
        </a>

        {wide ? (
          <div className="flex items-center gap-[clamp(20px,3vw,40px)] text-sm text-[rgba(243,240,234,.68)]">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={openCreateCardModal}
              className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-[11px] text-[13.5px] font-semibold tracking-[.01em] text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
            >
              Create your LuxeCard
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="rounded-full border border-[rgba(255,255,255,.16)] px-4 py-[9px] font-inter text-[11px] font-medium tracking-[.13em] text-ivory"
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        )}
      </div>

      {!wide && menuOpen && (
        <div
          className="flex flex-col gap-[18px] border-t border-[rgba(255,255,255,.08)] px-[clamp(20px,5vw,48px)] pb-7 pt-[18px]"
          style={{ background: 'rgba(8,8,10,.97)' }}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu} className="font-manrope text-[22px]">
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openCreateCardModal();
            }}
            className="mt-1.5 rounded-full bg-ivory py-[15px] text-center font-semibold text-ink"
          >
            Create your LuxeCard
          </button>
        </div>
      )}
    </nav>
  );
}
