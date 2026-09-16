import { useEffect, useRef, useState } from 'react';
import {
  PROFESSIONAL_CHIPS,
  PROFESSIONAL_PHOTOS,
  type PhotoMaterial,
  type ProfessionalPhoto,
} from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { RevealSection } from './RevealSection';

const MATERIAL_FILTERS: { value: PhotoMaterial; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'wood', label: 'Wood' },
  { value: 'metallic', label: 'Metallic' },
];

export function Professionals() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [filter, setFilter] = useState<PhotoMaterial | null>(null);
  const photos = filter ? PROFESSIONAL_PHOTOS.filter((p) => p.material === filter) : PROFESSIONAL_PHOTOS;

  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
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

        {isMobile ? <PhotoCarousel photos={photos} /> : <PhotoGrid photos={photos} />}

        <FilterPills active={filter} onChange={setFilter} />
      </div>
    </RevealSection>
  );
}

function FilterPills({
  active,
  onChange,
}: {
  active: PhotoMaterial | null;
  onChange: (value: PhotoMaterial | null) => void;
}) {
  const activeIndex = active ? MATERIAL_FILTERS.findIndex((f) => f.value === active) : -1;

  return (
    <div className="relative mt-8 grid max-w-[380px] grid-cols-3 rounded-full border border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.03)] p-1">
      {activeIndex >= 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-y-1 left-1 rounded-full bg-[#F3F0EA] transition-transform duration-300 ease-lux"
          style={{ width: 'calc((100% - 8px) / 3)', transform: `translateX(${activeIndex * 100}%)` }}
        />
      )}
      {MATERIAL_FILTERS.map((f) => {
        const selected = active === f.value;
        return (
          <button
            key={f.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? null : f.value)}
            className="relative z-10 flex items-center justify-center whitespace-nowrap rounded-full py-2.5 text-[13.5px] font-medium transition-colors duration-300"
            style={{ color: selected ? '#0B0B0D' : 'rgba(243,240,234,.6)' }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function PhotoGrid({ photos }: { photos: ProfessionalPhoto[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.caption} photo={photo} />
      ))}
    </div>
  );
}

function PhotoCarousel({ photos }: { photos: ProfessionalPhoto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [photos]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.min(photos.length - 1, Math.max(0, index)));
  };

  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    setActive(index);
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-[clamp(20px,4vw,48px)] flex snap-x snap-mandatory overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {photos.map((photo) => (
          <div key={photo.caption} className="w-full shrink-0 snap-center px-[clamp(20px,4vw,48px)]">
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.caption}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => goTo(i)}
            className="p-1.5"
          >
            <span
              aria-hidden="true"
              className="block h-[6px] rounded-full transition-[width,background-color] duration-300"
              style={{ width: i === active ? 22 : 6, background: i === active ? '#FDD303' : 'rgba(255,255,255,.2)' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function PhotoCard({ photo }: { photo: ProfessionalPhoto }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-[rgba(255,255,255,.07)]">
      {photo.image ? (
        <img src={photo.image} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
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
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[rgba(255,255,255,.1)] px-3.5 py-2 font-inter text-[10px] tracking-[.14em] text-grey-1">
      {label}
    </span>
  );
}
