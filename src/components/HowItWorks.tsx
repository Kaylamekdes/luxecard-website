import { useRef } from 'react';
import { DEMO_PROFILE, STAGES } from '../data/content';
import { useHowItWorksStage } from '../hooks/useHowItWorksStage';
import { RevealSection } from './RevealSection';

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { stage, select } = useHowItWorksStage(sectionRef);

  const actionsOpacity = stage >= 2 ? 1 : 0.15;
  const actionsTransform = stage >= 2 ? 'translateY(0)' : 'translateY(10px)';

  return (
    <RevealSection
      ref={sectionRef}
      id="how"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,160px)]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(48px,7vh,88px)] flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 font-manrope text-[clamp(38px,5.6vw,72px)] font-bold leading-none tracking-[-.032em]">
            ONE TAP.
            <br />
            EVERYTHING YOU.
          </h2>
          <p className="m-0 max-w-[320px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">
            Four stages, two seconds. Step through it below.
          </p>
        </div>

        <div
          className="grid items-center gap-[clamp(40px,5vw,80px)]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}
        >
          <div className="flex flex-col gap-2.5">
            {STAGES.map((s, i) => {
              const active = stage === i;
              return (
                <button
                  key={s.index}
                  type="button"
                  onClick={() => select(i)}
                  className="grid items-start gap-4 rounded-[14px] border px-5 py-[22px] text-left transition-colors duration-[.45s]"
                  style={{
                    gridTemplateColumns: '44px 1fr',
                    background: active ? 'rgba(253,211,3,.07)' : 'transparent',
                    borderColor: active ? 'rgba(253,211,3,.28)' : 'rgba(255,255,255,.07)',
                  }}
                >
                  <span
                    className="pt-1 font-inter text-[11px] tracking-[.1em]"
                    style={{ color: active ? '#FDD303' : '#8C8A85' }}
                  >
                    {s.index}
                  </span>
                  <span>
                    <span
                      className="block font-manrope text-[clamp(20px,2.2vw,27px)] font-medium tracking-[-.03em]"
                      style={{ color: active ? '#F3F0EA' : 'rgba(243,240,234,.55)' }}
                    >
                      {s.title}
                    </span>
                    <span className="mt-1.5 block max-w-[380px] text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">
                      {s.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden justify-center md:flex">
            <div
              className="relative w-[clamp(280px,32vw,360px)] rounded-[50px] p-3"
              style={{
                background: 'linear-gradient(160deg, #2A2A30, #101012 55%, #1C1C21)',
                boxShadow: '0 70px 120px -55px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.07)',
              }}
            >
              <div className="relative aspect-[9/19.2] overflow-hidden rounded-[39px] bg-[#0C0C0F]">
                <div className="absolute inset-x-0 top-[15px] z-[5] flex justify-between px-[22px] font-inter text-[10px] text-[rgba(243,240,234,.5)]">
                  <span>9:41</span>
                  <span>LTE</span>
                </div>

                {stage === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-[14px]">
                    <div
                      className="flex h-[78px] w-[78px] items-center justify-center rounded-full border font-inter text-[9px] tracking-[.14em] text-accent"
                      style={{ borderColor: 'rgba(253,211,3,.3)' }}
                    >
                      TAP
                    </div>
                    <div className="font-inter text-[9.5px] font-medium tracking-[.13em] text-[#55534F]">
                      HOLD CARD TO PHONE
                    </div>
                  </div>
                )}

                {(stage === 1 || stage === 2) && (
                  <div className="flex h-full flex-col gap-[14px] px-5 pb-5 pt-12">
                    <div
                      className="h-[76px] rounded-2xl border border-[rgba(255,255,255,.06)]"
                      style={{ background: 'linear-gradient(115deg, #202026, #14141A)' }}
                    />
                    <div className="-mt-10 flex items-end gap-[13px] px-1">
                      <div
                        className="flex h-[66px] w-[66px] flex-none items-center justify-center rounded-full border-2 border-[#0C0C0F] font-inter text-[7px] text-grey-1"
                        style={{ background: 'repeating-linear-gradient(45deg, #22222A 0 6px, #1A1A20 6px 12px)' }}
                      >
                        PHOTO
                      </div>
                      <div className="pb-1.5">
                        <div className="font-manrope text-[17px] font-semibold tracking-[-.02em]">
                          {DEMO_PROFILE.name}
                        </div>
                        <div className="text-[11px] text-[rgba(243,240,234,.5)]">{DEMO_PROFILE.title}</div>
                        <div className="mt-1 font-inter text-[8px] tracking-[.14em] text-grey-1">
                          LUXECARD PROFILE
                        </div>
                      </div>
                    </div>
                    <p className="m-0 mt-0.5 text-[11.5px] leading-[1.55] text-[rgba(243,240,234,.55)]">
                      Brand strategy and market entry for consumer businesses across East Africa.
                    </p>
                    <div
                      className="flex gap-[9px]"
                      style={{
                        opacity: actionsOpacity,
                        transform: actionsTransform,
                        transition: 'opacity .7s ease, transform .8s cubic-bezier(.16,1,.3,1)',
                      }}
                    >
                      <div className="flex-1 rounded-xl bg-ivory py-3 text-center text-xs font-semibold text-bg">
                        Save Contact
                      </div>
                      <div className="flex-1 rounded-xl border border-[rgba(255,255,255,.14)] py-3 text-center text-xs text-[rgba(243,240,234,.8)]">
                        WhatsApp
                      </div>
                    </div>
                    <div
                      className="flex gap-[7px] font-inter text-[8.5px] tracking-[.1em] text-[rgba(243,240,234,.55)]"
                      style={{ opacity: actionsOpacity, transition: 'opacity .7s ease .1s' }}
                    >
                      {['IG', 'IN', 'X', 'WEB'].map((s) => (
                        <span key={s} className="flex-1 rounded-[9px] bg-[rgba(255,255,255,.05)] py-2.5 text-center">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div
                      className="flex flex-col gap-[7px]"
                      style={{ opacity: actionsOpacity, transition: 'opacity .7s ease .18s' }}
                    >
                      {['Portfolio', 'Company site'].map((label) => (
                        <div
                          key={label}
                          className="flex justify-between rounded-[11px] bg-[rgba(255,255,255,.035)] px-[13px] py-3 text-[11.5px] text-[rgba(243,240,234,.78)]"
                        >
                          {label}
                          <span className="text-[#55534F]">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stage === 3 && (
                  <div className="absolute inset-0 flex flex-col gap-3 bg-bg-alt px-5 pb-5 pt-[52px]">
                    <div className="font-inter text-[9px] font-medium tracking-[.14em] text-grey-1">
                      AFTER THE CONVERSATION
                    </div>
                    <div className="flex items-center gap-3 rounded-[13px] bg-[rgba(255,255,255,.04)] p-3.5">
                      <div
                        className="h-[38px] w-[38px] rounded-full"
                        style={{ background: 'repeating-linear-gradient(45deg, #22222A 0 6px, #1A1A20 6px 12px)' }}
                      />
                      <div>
                        <div className="text-[12.5px]">{DEMO_PROFILE.name}</div>
                        <div className="text-[10px] text-[rgba(243,240,234,.45)]">Saved to contacts</div>
                      </div>
                    </div>
                    <div
                      className="rounded-[13px] border p-3.5"
                      style={{ borderColor: 'rgba(253,211,3,.24)', background: 'rgba(253,211,3,.07)' }}
                    >
                      <div className="text-xs text-ivory">
                        “Great meeting you at the summit — sending the deck over.”
                      </div>
                      <div className="mt-2.5 font-inter text-[8.5px] tracking-[.14em] text-grey-1">
                        FOLLOW-UP SENT
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-[7px]">
                      {['Share your profile back', 'Book a meeting'].map((label) => (
                        <div
                          key={label}
                          className="flex justify-between rounded-[11px] bg-[rgba(255,255,255,.035)] px-[13px] py-3 text-[11.5px] text-[rgba(243,240,234,.75)]"
                        >
                          {label}
                          <span className="text-[#55534F]">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
