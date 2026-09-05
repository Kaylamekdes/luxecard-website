import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function HeroTapVisual() {
  const narrow = useMediaQuery('(max-width: 899px)');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Belt-and-suspenders for autoplay: some browsers only honor a muted
    // autoplay if the property (not just the attribute) is set before play()
    // is attempted.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay was blocked; the video stays paused on its first frame.
    });
  }, []);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        minHeight: 'clamp(420px,56vh,560px)',
        paddingBottom: narrow ? '72px' : '56px',
        marginLeft: narrow ? undefined : 'clamp(40px,8vw,110px)',
      }}
    >
      <div
        className="absolute aspect-square w-[78%] rounded-full blur-[10px]"
        style={{ background: 'radial-gradient(circle, rgba(253,211,3,.13), transparent 62%)' }}
      />

      {/* phone */}
      <div
        className="relative z-[2] w-[clamp(238px,25vw,288px)] rounded-[42px] p-[10px]"
        style={{
          background: 'linear-gradient(160deg, #2A2A30, #101012 55%, #1C1C21)',
          boxShadow: '0 60px 100px -50px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.07)',
        }}
      >
        <div className="relative flex aspect-[9/19.2] flex-col overflow-hidden rounded-[33px] bg-[#0C0C0F]">
          <div className="absolute inset-x-0 top-3 z-[5] flex justify-between px-[18px] font-inter text-[9px] text-[rgba(243,240,234,.5)]">
            <span>9:41</span>
            <span>LTE</span>
          </div>

          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/videos/hero-tap-demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
