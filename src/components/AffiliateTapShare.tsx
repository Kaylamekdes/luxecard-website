import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

export function AffiliateTapShare() {
  const { ref, style, visible } = useReveal<HTMLDivElement>();
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => setTapped(true), 500);
    return () => clearTimeout(timeout);
  }, [visible]);

  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
      <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-12 text-center">
        <div>
          <div className="mb-4 font-inter text-[10px] font-medium tracking-[.2em] text-accent">
            SHARE YOUR LINK
          </div>
          <h2 className="m-0 font-manrope text-[clamp(32px,4.4vw,56px)] font-bold leading-[1.02] tracking-[-.032em]">
            As Effortless As
            <br />
            Tapping Your Card.
          </h2>
        </div>

        <div ref={ref} style={style} className="relative flex items-center justify-center py-6">
          {tapped &&
            [0, 0.7, 1.4].map((delay) => (
              <span
                key={delay}
                className="absolute aspect-square w-[180px] animate-lc-ripple rounded-full border"
                style={{ borderColor: 'rgba(253,211,3,.4)', animationDelay: `${delay}s` }}
              />
            ))}

          <div
            className="relative flex aspect-[1.6/1] w-[240px] flex-col justify-between overflow-hidden rounded-2xl p-5 transition-transform duration-500 ease-lux"
            style={{
              background: 'linear-gradient(132deg, #26262B 0%, #101013 46%, #1A1A1F 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.09), 0 40px 80px -35px rgba(0,0,0,.9)',
              transform: tapped ? 'translateY(-10px) scale(1.03)' : 'none',
            }}
          >
            <img src="/images/luxecard-logo.webp" alt="LuxeCard" width={748} height={140} className="h-5 w-auto" />
            <span className="font-inter text-[9px] font-medium tracking-[.14em] text-grey-1">NFC + QR</span>
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl border-2 transition-opacity duration-500"
              style={{ borderColor: '#FDD303', opacity: tapped ? 1 : 0 }}
            />
          </div>

          <div
            className="absolute -right-4 -top-8 flex items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(253,211,3,.35)] bg-[#101013] px-4 py-2.5 shadow-lg transition-[opacity,transform] duration-500 ease-lux min-[560px]:-right-12"
            style={{
              opacity: tapped ? 1 : 0,
              transform: tapped ? 'translateY(0)' : 'translateY(10px)',
              transitionDelay: '250ms',
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-ink">
              <Check size={13} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="text-[13px] font-medium text-ivory">Link shared</span>
          </div>
        </div>

        <p className="m-0 max-w-[420px] text-[15px] leading-[1.6] text-[rgba(243,240,234,.5)]">
          One tap, one link, one introduction: that's all it takes to start earning.
        </p>
      </div>
    </RevealSection>
  );
}
