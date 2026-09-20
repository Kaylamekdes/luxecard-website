import { useEffect } from 'react';
import { LINKS } from '../data/links';

export function ContactOptionsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const options = [
    { label: `Call ${LINKS.PHONE_DISPLAY}`, href: LINKS.PHONE_TEL },
    { label: `Call ${LINKS.PHONE2_DISPLAY}`, href: LINKS.PHONE2_TEL },
    { label: `Email ${LINKS.EMAIL}`, href: LINKS.EMAIL_MAILTO },
  ];

  return (
    <div
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ease-lux"
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        background: 'rgba(8,8,10,.82)',
        backdropFilter: 'blur(14px) saturate(140%)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact us"
        className="relative w-full max-w-[360px] rounded-[22px] border border-[rgba(255,255,255,.1)] p-7 shadow-2xl transition-transform duration-300 ease-lux"
        style={{
          background: 'radial-gradient(120% 100% at 50% 0%, #17171B 0%, #0C0C0E 60%)',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(12px) scale(.97)',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.7)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,.14)] text-[15px] text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          ✕
        </button>

        <div className="mb-6 mt-2 font-inter text-[10.5px] font-medium tracking-[.14em] text-accent">CONTACT US</div>

        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <a
              key={option.label}
              href={option.href}
              className="rounded-xl border border-[rgba(255,255,255,.14)] bg-[rgba(255,255,255,.03)] px-4 py-3 text-[15px] text-ivory transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
