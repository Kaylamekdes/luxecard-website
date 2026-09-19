import { useMemo, useState } from 'react';
import { CARD_FINISHES } from '../data/content';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { useMountReveal } from '../hooks/useMountReveal';
import { formatKes, parsePrice } from '../utils/formatPrice';

const FINISH_OPTIONS = CARD_FINISHES.map((f) => ({ name: f.name, price: parsePrice(f.price) }));
const COMMISSION_RATE = 0.1;
const MIN_CARDS = 1;
const MAX_CARDS = 20;
const DEFAULT_CARDS = 6;
const DEFAULT_FINISH_INDEX = 1; // Plastic

export function AffiliateHero() {
  const textStyle = useMountReveal(80);
  const calcStyle = useMountReveal(280);
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [finishIndex, setFinishIndex] = useState(DEFAULT_FINISH_INDEX);

  const finish = FINISH_OPTIONS[finishIndex];
  const targetEarnings = useMemo(() => cards * finish.price * COMMISSION_RATE, [cards, finish.price]);
  const displayEarnings = useAnimatedNumber(targetEarnings);
  const isSettling = Math.abs(displayEarnings - targetEarnings) > 1;
  const pct = ((cards - MIN_CARDS) / (MAX_CARDS - MIN_CARDS)) * 100;

  return (
    <section
      id="top"
      className="relative px-[clamp(20px,4vw,48px)] pb-[clamp(64px,9vh,120px)] pt-[clamp(36px,calc(15vh-84px),96px)] min-[900px]:pt-[clamp(24px,calc(15vh-80px),84px)]"
      style={{ background: 'radial-gradient(120% 90% at 78% 10%, #16161A 0%, #0B0B0D 46%, #08080A 100%)' }}
    >
      <div
        className="mx-auto grid max-w-[1320px] items-center gap-[clamp(48px,6vw,80px)]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}
      >
        <div style={textStyle}>
          <div className="mb-5 font-inter text-[10px] font-medium tracking-[.2em] text-accent">
            AFFILIATE PROGRAM
          </div>
          <h1 className="m-0 mb-6 font-manrope text-[clamp(34px,5.4vw,64px)] font-extrabold leading-[.98] tracking-[-.035em]">
            Earn With Every <span className="text-accent">Introduction</span> You Make.
          </h1>
          <p className="m-0 mb-8 max-w-[440px] text-[clamp(16px,1.3vw,18px)] leading-[1.5] text-[rgba(243,240,234,.6)]">
            Share LuxeCard with your network and earn 10% commission whenever someone buys through your unique
            referral link.
          </p>
          <a
            href="#affiliate-signup"
            className="inline-flex items-center gap-2.5 rounded-full bg-ivory px-[clamp(16px,5vw,30px)] py-[clamp(12px,3.5vw,17px)] text-[clamp(12.5px,3.2vw,15.5px)] font-semibold text-bg transition-[transform,box-shadow] duration-[.4s] ease-lux hover:-translate-y-[3px]"
            style={{ boxShadow: '0 18px 44px -22px rgba(243,240,234,.6)' }}
          >
            Become an Affiliate
          </a>
        </div>

        <div style={calcStyle}>
          <div
            className="rounded-[26px] border border-[rgba(255,255,255,.1)] p-[clamp(24px,3.4vw,38px)]"
            style={{
              background: 'radial-gradient(120% 100% at 50% 0%, #17171B 0%, #0C0C0E 60%)',
              boxShadow: '0 50px 90px -40px rgba(0,0,0,.85)',
            }}
          >
            <div className="mb-1 font-inter text-[10px] font-medium tracking-[.15em] text-grey-1">
              EARNINGS CALCULATOR
            </div>
            <p className="m-0 mb-5 text-[16px] leading-[1.4] text-ivory">Which finish are you sharing?</p>

            <div className="mb-7 grid grid-cols-2 gap-2.5">
              {FINISH_OPTIONS.map((f, i) => {
                const selected = i === finishIndex;
                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setFinishIndex(i)}
                    aria-pressed={selected}
                    className="flex flex-col items-start gap-0.5 rounded-xl border px-3.5 py-3 text-left transition-colors duration-300"
                    style={{
                      borderColor: selected ? '#FDD303' : 'rgba(255,255,255,.14)',
                      background: selected ? 'rgba(253,211,3,.08)' : 'transparent',
                    }}
                  >
                    <span
                      className="text-[13px] font-medium leading-[1.25]"
                      style={{ color: selected ? '#FDD303' : '#F3F0EA' }}
                    >
                      {f.name}
                    </span>
                    <span className="text-[11.5px] text-[rgba(243,240,234,.45)]">{formatKes(f.price)}</span>
                  </button>
                );
              })}
            </div>

            <p className="m-0 mb-4 text-[16px] leading-[1.4] text-ivory">How many cards will you refer per month?</p>

            <input
              type="range"
              min={MIN_CARDS}
              max={MAX_CARDS}
              step={1}
              value={cards}
              onChange={(e) => setCards(Number(e.target.value))}
              aria-label="Cards referred per month"
              className="h-2 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#0B0B0D] [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#0B0B0D] [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-[0_4px_14px_rgba(253,211,3,.55)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 active:[&::-webkit-slider-thumb]:scale-125"
              style={{
                background: `linear-gradient(to right, #FDD303 0%, #FDD303 ${pct}%, rgba(255,255,255,.14) ${pct}%, rgba(255,255,255,.14) 100%)`,
              }}
            />

            <div className="mt-3 flex items-center justify-between font-inter text-[11px] tracking-[.08em] text-grey-1">
              <span>1 CARD</span>
              <span className="text-ivory">
                {cards} {cards === 1 ? 'CARD' : 'CARDS'} / MONTH
              </span>
              <span>20+ CARDS</span>
            </div>

            <div className="mt-9 border-t border-[rgba(255,255,255,.08)] pt-8 text-center">
              <div className="font-inter text-[10px] font-medium tracking-[.15em] text-grey-1">
                YOUR POTENTIAL EARNINGS
              </div>
              <div
                className="mt-3 font-manrope text-[clamp(44px,7vw,64px)] font-extrabold leading-none tracking-[-.03em] text-accent transition-transform duration-200 ease-out"
                style={{ transform: isSettling ? 'scale(1.04)' : 'scale(1)' }}
              >
                {formatKes(displayEarnings)}
              </div>
              <div className="mt-2 text-[13.5px] text-[rgba(243,240,234,.45)]">per month, at 10% commission</div>
              <div className="mt-0.5 text-[13.5px] text-[rgba(243,240,234,.45)]">
                {cards} × {finish.name} ({formatKes(finish.price)} each)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
