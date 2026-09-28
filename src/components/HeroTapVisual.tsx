import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const VIDEO_SRC = '/videos/hero-tap-demo.mp4';
const POSTER_SRC = '/images/hero-tap-poster.webp';

export function HeroTapVisual() {
  const narrow = useMediaQuery('(max-width: 899px)');
  const videoRef = useRef<HTMLVideoElement>(null);

  // `narrow` swaps in a different <video> element, so re-attach when it flips.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Belt-and-suspenders for autoplay: some browsers only honor a muted
    // autoplay if the property (not just the attribute) is set before play()
    // is attempted.
    video.muted = true;

    let onScreen = false;
    let sourceAttached = false;

    // Only play while the video is on screen and the tab is visible: it loops
    // forever, so left alone it keeps decoding video that nobody can see.
    const sync = () => {
      if (!sourceAttached) return;
      if (onScreen && !document.hidden) {
        video.play().catch(() => {
          // Autoplay was blocked; the video stays on its poster frame.
        });
      } else {
        video.pause();
      }
    };

    const attachSource = () => {
      if (sourceAttached) return;
      sourceAttached = true;
      video.src = VIDEO_SRC;
      video.load();
      sync();
    };

    // Mobile: the poster shows instantly, and the video itself doesn't start
    // downloading until the rest of the page has finished loading, so it
    // never competes with everything else for bandwidth on first paint.
    // Desktop: restored to exactly how it behaved before that deferral was
    // added — the video attaches and starts loading immediately, in step
    // with the shader and hero text, instead of popping in later on its own
    // once `load` fires.
    if (narrow) {
      if (document.readyState === 'complete') {
        attachSource();
      } else {
        window.addEventListener('load', attachSource, { once: true });
      }
    } else {
      attachSource();
    }

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('load', attachSource);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [narrow]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        minHeight: 'clamp(420px,56vh,560px)',
        paddingTop: narrow ? undefined : '28px',
        paddingBottom: narrow ? '72px' : '28px',
        marginLeft: narrow ? undefined : 'clamp(40px,8vw,110px)',
      }}
    >
      <div
        className="absolute aspect-square w-[78%] rounded-full blur-[10px]"
        style={{ background: 'radial-gradient(circle, rgba(253,211,3,.13), transparent 62%)' }}
      />

      {narrow ? (
        /* plain video frame */
        <div
          className="relative z-[2] overflow-hidden rounded-2xl"
          style={{
            width: 'clamp(280px,82vw,360px)',
            boxShadow: '0 40px 80px -35px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.08)',
          }}
        >
          <div className="relative aspect-[9/12] w-full bg-[#0C0C0F]">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              preload="none"
              poster={POSTER_SRC}
            />
          </div>
        </div>
      ) : (
        /* phone */
        <div
          className="relative z-[2] rounded-[42px] p-[10px]"
          style={{
            width: 'clamp(238px,25vw,288px)',
            background: 'linear-gradient(160deg, #2A2A30, #101012 55%, #1C1C21)',
            boxShadow: '0 60px 100px -50px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.07)',
          }}
        >
          <div className="relative flex aspect-[9/19.2] flex-col overflow-hidden rounded-[33px] bg-[#0C0C0F]">
            <div className="absolute inset-x-0 top-3 z-[5] flex justify-between px-[18px] font-inter text-[9px] text-[rgba(243,240,234,.5)]">
              <span>9:41</span>
              <span>LTE</span>
            </div>

            <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="auto">
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
