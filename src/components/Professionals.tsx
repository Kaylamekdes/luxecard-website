import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  PROFESSIONAL_CHIPS,
  PROFESSIONAL_PHOTOS,
  type PhotoMaterial,
  type ProfessionalPhoto,
} from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

const GRID_COLUMNS = 3;
const COLLAPSED_COUNT = GRID_COLUMNS * 3; // the desktop grid starts as three rows
const EXPAND_MS = 650;
const FADE_MS = 350;

const MATERIAL_FILTERS: { value: PhotoMaterial; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'wood', label: 'Wood' },
  { value: 'metallic', label: 'Metallic' },
];

export function Professionals() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [filter, setFilter] = useState<PhotoMaterial | null>('plastic');
  const photos =
    isMobile && filter ? PROFESSIONAL_PHOTOS.filter((p) => p.material === filter) : PROFESSIONAL_PHOTOS;

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

        {isMobile && <FilterPills active={filter} onChange={setFilter} />}
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

// Desktop grid. It always starts collapsed to its first three rows, with the
// third row faded and blurred behind a "View More" button; the button expands
// it smoothly. State is deliberately not persisted anywhere, so a refresh
// starts collapsed, and it also collapses itself once the user scrolls away.
function PhotoGrid({ photos }: { photos: ProfessionalPhoto[] }) {
  const reducedMotion = useReducedMotion();
  const clipRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const viewMoreRef = useRef<HTMLButtonElement>(null);
  const skipMotion = useRef(false);
  const preloaded = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [heights, setHeights] = useState<{ collapsed: number; full: number; row: number } | null>(null);
  const collapsible = photos.length > COLLAPSED_COUNT;
  const animate = !reducedMotion && !skipMotion.current;

  // Measure the collapsed (first three rows) and full heights before paint so
  // the grid never flashes fully open, and keep them right as the width changes.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !collapsible) return;
    const measure = () => {
      const lastVisible = grid.children[COLLAPSED_COUNT - 1] as HTMLElement | undefined;
      if (!lastVisible) return;
      const next = {
        collapsed: lastVisible.offsetTop + lastVisible.offsetHeight,
        full: grid.scrollHeight,
        row: lastVisible.offsetHeight,
      };
      setHeights((prev) =>
        prev && prev.collapsed === next.collapsed && prev.full === next.full && prev.row === next.row ? prev : next
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [collapsible]);

  // Once expanded, scrolling away from the grid puts it back to its default
  // state. The collapse waits for scrolling to settle (so it never fights
  // smooth-scroll momentum) and happens instantly and invisibly; if the grid
  // is above the viewport, the scroll position is shifted by the height that
  // was removed so nothing on screen moves.
  useEffect(() => {
    const clip = clipRef.current;
    if (!expanded || !clip) return;
    let poll: number | undefined;
    const stopPolling = () => {
      if (poll !== undefined) {
        window.clearInterval(poll);
        poll = undefined;
      }
    };

    const collapseSilently = () => {
      const above = clip.getBoundingClientRect().bottom <= 0;
      const before = clip.offsetHeight;
      skipMotion.current = true;
      flushSync(() => setExpanded(false));
      skipMotion.current = false;
      if (above) window.scrollBy({ top: clip.offsetHeight - before, behavior: 'instant' });
    };

    const observer = new IntersectionObserver(([entry]) => {
      stopPolling();
      if (entry.isIntersecting) return;
      let lastY = window.scrollY;
      poll = window.setInterval(() => {
        if (window.scrollY !== lastY) {
          lastY = window.scrollY;
          return;
        }
        stopPolling();
        collapseSilently();
      }, 150);
    });
    observer.observe(clip);
    return () => {
      observer.disconnect();
      stopPolling();
    };
  }, [expanded]);

  // The hidden rows are lazy-loaded; fetch them as soon as the button is
  // approached so they're ready by the time the rows open.
  const preloadRest = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    photos.slice(COLLAPSED_COUNT).forEach((photo) => {
      if (photo.image) new Image().src = photo.image;
    });
  };

  const expand = () => {
    preloadRest();
    setExpanded(true);
    clipRef.current?.focus({ preventScroll: true });
  };

  const collapse = () => {
    const section = clipRef.current?.closest('section');
    const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 80;
    setExpanded(false);
    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - navHeight,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
    requestAnimationFrame(() => viewMoreRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div>
      <div
        ref={clipRef}
        id="portfolio-grid"
        tabIndex={-1}
        className="relative overflow-hidden outline-none"
        style={{
          height: collapsible && heights ? (expanded ? heights.full : heights.collapsed) : undefined,
          transition: animate ? `height ${EXPAND_MS}ms cubic-bezier(.16,1,.3,1)` : 'none',
        }}
      >
        <div ref={gridRef} className="relative grid grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <PhotoCard key={photo.caption} photo={photo} index={i % GRID_COLUMNS} />
          ))}
        </div>

        {collapsible && heights && (
          <div
            aria-hidden={expanded}
            className="absolute inset-x-0 bottom-0 flex items-center justify-center"
            style={{
              height: heights.row,
              opacity: expanded ? 0 : 1,
              pointerEvents: expanded ? 'none' : 'auto',
              visibility: expanded ? 'hidden' : 'visible',
              transition: animate
                ? `opacity ${FADE_MS}ms ease-out, visibility 0s linear ${expanded ? `${FADE_MS}ms` : '0s'}`
                : 'none',
            }}
          >
            {/* progressive blur: clear along the top of the row, fully blurred at the bottom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-b-2xl"
              style={{
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, #000 55%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 55%)',
              }}
            />
            {/* fade toward the section background (bg-alt) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(10,10,12,0) 0%, rgba(10,10,12,.6) 50%, rgba(10,10,12,.94) 100%)',
              }}
            />
            <button
              ref={viewMoreRef}
              type="button"
              aria-expanded={expanded}
              aria-controls="portfolio-grid"
              onClick={expand}
              onPointerEnter={preloadRest}
              onFocus={preloadRest}
              className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
            >
              View More
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {collapsible && expanded && (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            aria-controls="portfolio-grid"
            aria-expanded={expanded}
            onClick={collapse}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,.14)] px-7 py-[13px] text-[14px] font-medium text-ivory transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Show less
            <ChevronUp size={15} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function PhotoCarousel({ photos }: { photos: ProfessionalPhoto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      setActive(0);
      scrollRef.current?.scrollTo({ left: 0 });
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
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
        className="-mx-[clamp(20px,4vw,48px)] flex snap-x snap-mandatory overflow-x-auto scroll-smooth transition-opacity duration-200 ease-out [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', opacity: visible ? 1 : 0 }}
      >
        {photos.map((photo, i) => (
          <div key={photo.caption} className="w-full shrink-0 snap-center px-[clamp(20px,4vw,48px)]">
            <PhotoCard photo={photo} index={i} />
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

function PhotoCard({ photo, index = 0 }: { photo: ProfessionalPhoto; index?: number }) {
  const { ref, style } = useReveal<HTMLDivElement>(index * 80);

  return (
    <div
      ref={ref}
      style={style}
      className="relative aspect-square overflow-hidden rounded-2xl border border-[rgba(255,255,255,.07)]"
    >
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
