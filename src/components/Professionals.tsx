import { useEffect, useRef, useState } from 'react';
import { PROFESSIONAL_CHIPS, PROFESSIONAL_PHOTOS } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { RevealSection } from './RevealSection';

const MOBILE_PREVIEW_COUNT = 4;

export function Professionals() {
  const [expanded, setExpanded] = useState(false);
  const narrow = useMediaQuery('(max-width: 559px)');
  const collapsed = narrow && !expanded;
  const photos = collapsed ? PROFESSIONAL_PHOTOS.slice(0, MOBILE_PREVIEW_COUNT) : PROFESSIONAL_PHOTOS;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setExpanded(false);
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <RevealSection
      ref={sectionRef}
      className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(40px,5vh,64px)] flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
            TRUSTED ACROSS
            <br />
            INDUSTRIES.
          </h2>
          <div className="flex max-w-[420px] flex-wrap gap-2">
            {PROFESSIONAL_CHIPS.map((chip) => (
              <Chip key={chip} label={chip} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 min-[560px]:grid-cols-3 min-[900px]:gap-4">
          {photos.map((photo) => (
            <div
              key={photo.caption}
              className="relative aspect-square overflow-hidden rounded-2xl border border-[rgba(255,255,255,.07)]"
            >
              {photo.image ? (
                <img
                  src={photo.image}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-full items-end p-5"
                  style={{ background: 'repeating-linear-gradient(45deg, #15151A 0 14px, #101015 14px 28px)' }}
                >
                  <span className="whitespace-pre-line font-inter text-[9.5px] leading-[1.7] tracking-[.1em] text-grey-1">
                    {photo.caption}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {collapsed && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,.14)] px-6 py-3 text-[13.5px] font-medium text-ivory transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </RevealSection>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[rgba(255,255,255,.1)] px-3.5 py-2 font-inter text-[10px] tracking-[.14em] text-grey-1">
      {label}
    </span>
  );
}
