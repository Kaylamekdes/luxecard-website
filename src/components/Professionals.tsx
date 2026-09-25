import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
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
// Height of the blur band over the last collapsed row: a fraction of the row,
// but never so short that the button doesn't fit comfortably inside it.
const OVERLAY_ROW_FRACTION = 0.38;
const OVERLAY_MIN_PX = 120;

const MATERIAL_FILTERS: { value: PhotoMaterial; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'wood', label: 'Wood' },
  { value: 'metallic', label: 'Metallic' },
];

export function Professionals() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [filter, setFilter] = useState<PhotoMaterial | null>('plastic');
  // Each finish keeps its own slide position, independent of the others.
  const positions = useRef<Record<string, number>>({});
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

        {isMobile ? (
          <PhotoCarousel key={filter ?? 'all'} id={filter ?? 'all'} photos={photos} positions={positions} />
        ) : (
          <PhotoGrid photos={photos} />
        )}

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

  // "Show less": collapse the grid with its usual animation while easing the
  // scroll position so the collapsed grid's bottom edge (and its "View More"
  // button) ends up in view. The old smooth scrollTo fought Lenis and the page
  // shrinking under it, which threw the user to the bottom of the page.
  const collapse = () => {
    const clip = clipRef.current;
    const collapsedHeight = heights?.collapsed;
    setExpanded(false);
    requestAnimationFrame(() => viewMoreRef.current?.focus({ preventScroll: true }));
    if (!clip || collapsedHeight === undefined) return;

    const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 80;
    const startY = window.scrollY;
    const clipTop = clip.getBoundingClientRect().top + startY;
    // Land with the collapsed grid's bottom a comfortable distance above the
    // viewport's bottom edge, but never scroll the grid's top under the nav.
    const bottomGap = Math.min(160, window.innerHeight * 0.2);
    const wanted = clipTop + collapsedHeight - window.innerHeight + bottomGap;
    const targetY = Math.max(0, Math.min(startY, Math.max(wanted, clipTop - navHeight - 24)));
    if (targetY === startY) return;
    if (reducedMotion) {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      return;
    }

    // Same duration and easing as the height animation, so the two move together.
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / EXPAND_MS);
      const eased = 1 - Math.pow(1 - t, 4);
      window.scrollTo({ top: startY + (targetY - startY) * eased, behavior: 'instant' });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
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
              // Only a band along the bottom of the third row, not the whole
              // row; the button is centered inside it.
              height: Math.min(heights.row, Math.max(OVERLAY_MIN_PX, Math.round(heights.row * OVERLAY_ROW_FRACTION))),
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

const DOT_COUNT = 3;
const DOT_REST_PX = 6;
const DOT_ACTIVE_PX = 22;
const SNAP_MS = 300;
const SNAP_EASE = 'cubic-bezier(.22,.9,.3,1)'; // decelerates to a stop, never overshoots
const AXIS_LOCK_PX = 8; // movement before we decide whether the gesture is horizontal or vertical
const SWIPE_FRACTION = 0.2; // drag further than this share of the width to change slide
const FLICK_PX_PER_MS = 0.35; // ...or release faster than this

type CarouselDrag = {
  active: boolean;
  locked: boolean;
  startX: number;
  startY: number;
  dx: number;
  samples: { x: number; t: number }[];
};

// Mobile carousel. It is driven by pointer events and a CSS transform instead
// of native overflow scrolling + scroll-snap, on purpose: native touch
// scrolling adds platform momentum and edge rubber-banding (iOS especially)
// that can't be switched off from CSS, which read as a loose, springy
// container. Here the track follows the finger 1:1, moves exactly one slide
// per swipe, eases to a stop in SNAP_MS with no overshoot, and is clamped at
// both ends. Vertical gestures are left to the browser (touch-action: pan-y),
// so the page still scrolls normally over it.
//
// It is remounted per finish (keyed by `id`) and each finish remembers its own
// slide in `positions`. Scroll progress is painted straight to the DOM, so
// nothing re-renders while dragging.
function PhotoCarousel({
  id,
  photos,
  positions,
}: {
  id: string;
  photos: ProfessionalPhoto[];
  positions: MutableRefObject<Record<string, number>>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const index = useRef(0);
  const width = useRef(0);
  const drag = useRef<CarouselDrag>({ active: false, locked: false, startX: 0, startY: 0, dx: 0, samples: [] });
  const [visible, setVisible] = useState(false);
  const count = photos.length;

  // Positions the track (and the three dots) for `index` plus a live drag
  // offset in px; `animate` eases there, otherwise it is applied instantly.
  const paint = useCallback(
    (offset: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transition = animate ? `transform ${SNAP_MS}ms ${SNAP_EASE}` : 'none';
      track.style.transform = `translate3d(${-index.current * width.current + offset}px,0,0)`;

      const slidePos = width.current > 0 ? index.current - offset / width.current : index.current;
      const progress = count > 1 ? Math.min(1, Math.max(0, slidePos / (count - 1))) : 0;
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const closeness = Math.max(0, 1 - Math.abs(progress * (DOT_COUNT - 1) - i));
        dot.style.transition = animate ? `width ${SNAP_MS}ms ${SNAP_EASE}, background-color ${SNAP_MS}ms ease` : 'none';
        dot.style.width = `${DOT_REST_PX + (DOT_ACTIVE_PX - DOT_REST_PX) * closeness}px`;
        dot.style.backgroundColor = `color-mix(in srgb, #FDD303 ${Math.round(closeness * 100)}%, rgba(255,255,255,.2))`;
      });
    },
    [count]
  );

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(count - 1, Math.max(0, next));
      if (clamped !== index.current) {
        index.current = clamped;
        positions.current[id] = clamped;
      }
      paint(0, true);
    },
    [count, id, paint, positions]
  );

  // Restore this finish's saved slide before paint (instantly), keep the
  // track sized to the container, then fade in.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    index.current = Math.min(count - 1, positions.current[id] ?? 0);
    const measure = () => {
      width.current = viewport.clientWidth;
      paint(0, false);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [id, count, paint, positions]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { active: true, locked: false, startX: e.clientX, startY: e.clientY, dx: 0, samples: [{ x: e.clientX, t: e.timeStamp }] };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    let dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.locked) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        d.active = false; // a vertical scroll: leave it to the browser
        return;
      }
      d.locked = true;
      viewportRef.current?.setPointerCapture(e.pointerId);
    }
    // Hard stop at both ends: no drag past the first or last photo.
    if ((index.current === 0 && dx > 0) || (index.current === count - 1 && dx < 0)) dx = 0;
    d.dx = dx;
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
    paint(dx, false);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    const wasDragging = d.active && d.locked;
    d.active = false;
    if (!wasDragging) return;
    if (viewportRef.current?.hasPointerCapture(e.pointerId)) viewportRef.current.releasePointerCapture(e.pointerId);

    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const velocity = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0; // px/ms, negative = leftward
    const far = Math.abs(d.dx) > width.current * SWIPE_FRACTION;
    const flick = Math.abs(velocity) > FLICK_PX_PER_MS && Math.sign(velocity) === Math.sign(d.dx);
    // One slide per swipe, however hard the flick.
    if (!cancelled && (far || flick)) goTo(index.current + (d.dx < 0 ? 1 : -1));
    else paint(0, true);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') goTo(index.current + 1);
    else if (e.key === 'ArrowLeft') goTo(index.current - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Portfolio photos"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e, false)}
        onPointerCancel={(e) => endDrag(e, true)}
        onKeyDown={onKeyDown}
        onDragStart={(e) => e.preventDefault()}
        className="-mx-[clamp(20px,4vw,48px)] touch-pan-y select-none overflow-hidden outline-none transition-opacity duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div ref={trackRef} className="flex will-change-transform">
          {photos.map((photo, i) => (
            <div key={photo.caption} className="w-full shrink-0 px-[clamp(20px,4vw,48px)]">
              <PhotoCard photo={photo} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Three dots however many photos there are: the highlight glides from
          the first to the last dot as the gallery moves. */}
      <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: DOT_COUNT }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            className="block h-[6px] rounded-full"
            style={{ width: DOT_REST_PX, backgroundColor: 'rgba(255,255,255,.2)' }}
          />
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
