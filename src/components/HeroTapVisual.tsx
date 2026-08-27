import { DEMO_PROFILE } from '../data/content';
import { useHeroTapLoop } from '../hooks/useHeroTapLoop';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function HeroTapVisual() {
  const { step, replay } = useHeroTapLoop();
  const narrow = useMediaQuery('(max-width: 899px)');

  const idleX = narrow ? '-6%' : '0%';
  const cardTransform =
    step <= 0 || step >= 5
      ? `translate(${idleX}, 150%) scale(.95)`
      : step === 1 || step === 2
        ? 'translate(30%, -2%) scale(1.02)'
        : `translate(${idleX}, 150%) scale(.95)`;

  const idle = step < 3;
  const screenOpacity = step >= 3 ? 1 : 0;
  const screenTransform = step >= 3 ? 'translateY(0)' : 'translateY(14px)';
  const toastOpacity = step === 4 ? 1 : 0;
  const toastTransform = step === 4 ? 'translateY(0)' : 'translateY(12px)';
  const rippleOpacity = step === 2 ? 1 : 0;
  const rippleAnimation = step === 2 ? 'lcRipple 1.1s ease-out' : 'none';

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

          {idle && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] bg-bg-alt">
              <div className="font-manrope text-[46px] font-medium tracking-[-.03em] text-[rgba(243,240,234,.9)]">
                9:41
              </div>
              <div className="font-inter text-[9px] font-medium tracking-[.14em] text-[#55534F]">
                HOLD NEAR CARD
              </div>
            </div>
          )}

          <div
            className="flex h-full flex-col gap-3 px-4 pb-4 pt-10"
            style={{
              opacity: screenOpacity,
              transform: screenTransform,
              transition: 'opacity .8s ease, transform .9s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div
              className="h-[62px] rounded-[14px] border border-[rgba(255,255,255,.06)]"
              style={{ background: 'linear-gradient(115deg, #1E1E23, #14141A)' }}
            />
            <div className="-mt-[34px] flex items-end gap-[11px] px-1">
              <div
                className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full border-2 border-[#0C0C0F] text-center font-inter text-[6.5px] text-grey-1"
                style={{ background: 'repeating-linear-gradient(45deg, #22222A 0 6px, #1A1A20 6px 12px)' }}
              >
                PHOTO
              </div>
              <div className="pb-1">
                <div className="font-manrope text-[14.5px] font-semibold tracking-[-.02em]">{DEMO_PROFILE.name}</div>
                <div className="text-[9.5px] text-[rgba(243,240,234,.5)]">{DEMO_PROFILE.title}</div>
              </div>
            </div>
            <div className="mt-1 flex gap-2">
              <div className="flex-1 rounded-[10px] bg-ivory py-[9px] text-center text-[10.5px] font-semibold text-bg">
                Save Contact
              </div>
              <div className="flex-1 rounded-[10px] border border-[rgba(255,255,255,.14)] py-[9px] text-center text-[10.5px] text-[rgba(243,240,234,.8)]">
                WhatsApp
              </div>
            </div>
            <div className="flex gap-1.5 font-inter text-[8px] tracking-[.1em] text-[rgba(243,240,234,.55)]">
              {['IG', 'IN', 'X', 'WEB'].map((s) => (
                <span key={s} className="flex-1 rounded-lg bg-[rgba(255,255,255,.05)] py-2 text-center">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-0.5 flex flex-col gap-1.5">
              {['Portfolio', 'Book a meeting'].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-[10px] bg-[rgba(255,255,255,.035)] px-[11px] py-[10px] text-[10px] text-[rgba(243,240,234,.78)]"
                >
                  {label}
                  <span className="text-[#55534F]">→</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute inset-x-[14px] bottom-4 flex items-center gap-[9px] rounded-[13px] border px-[13px] py-[11px] backdrop-blur-[8px]"
            style={{
              background: 'rgba(253,211,3,.14)',
              borderColor: 'rgba(253,211,3,.32)',
              opacity: toastOpacity,
              transform: toastTransform,
              transition: 'opacity .6s ease, transform .7s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[10.5px] text-ivory">Contact saved</span>
          </div>
        </div>
      </div>

      {/* ripple */}
      <div
        className="pointer-events-none absolute z-[3] left-[34%] top-[16%] h-[120px] w-[120px] rounded-full border"
        style={{
          borderColor: 'rgba(253,211,3,.5)',
          opacity: rippleOpacity,
          animation: rippleAnimation,
        }}
      />

      {/* card */}
      <div
        className="absolute left-0 top-[10%] z-[4] flex aspect-[1.6] w-[clamp(230px,24vw,300px)] flex-col justify-between rounded-2xl border p-[18px]"
        style={{
          background: 'linear-gradient(132deg, #26262B 0%, #101013 46%, #1A1A1F 100%)',
          borderColor: 'rgba(255,255,255,.11)',
          boxShadow: '0 44px 80px -34px rgba(0,0,0,.95), inset 0 1px 0 rgba(255,255,255,.09)',
          width: narrow ? undefined : 'clamp(220px,20vw,270px)',
          transform: cardTransform,
          transition: 'transform 1.1s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="font-manrope text-[15px] font-semibold tracking-[-.02em]">LuxeCard</div>
          <div className="flex items-center gap-1.5 font-inter text-[8px] font-medium tracking-[.13em] text-grey-1">
            <span className="h-1 w-1 rounded-full bg-accent" />
            NFC
          </div>
        </div>
        <div>
          <div className="text-[12.5px] text-[rgba(243,240,234,.9)]">{DEMO_PROFILE.name}</div>
          <div className="mt-1 font-inter text-[8.5px] tracking-[.14em] text-grey-1">TAP. SCAN. CONNECT.</div>
        </div>
      </div>

      <button
        type="button"
        onClick={replay}
        className="absolute right-0 z-[6] rounded-full border border-[rgba(255,255,255,.14)] px-[15px] py-2 font-inter text-[9.5px] font-medium tracking-[.13em] text-[rgba(243,240,234,.6)] transition-colors duration-300 ease-out hover:border-accent hover:text-ivory"
        style={{ bottom: narrow ? '-14px' : '-8px' }}
      >
        REPLAY TAP
      </button>
    </div>
  );
}
