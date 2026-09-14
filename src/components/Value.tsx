import { VALUE_PILLARS, type ValuePillar } from '../data/content';
import { useReveal } from '../hooks/useReveal';

const STACK_SCALE = [1, 0.97, 0.94];
const STACK_OVERLAP = 84;

export function Value() {
  const { ref, style } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      style={style}
      className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(44px,6vh,76px)] flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
            MORE THAN A
            <br />
            BUSINESS CARD.
          </h2>
          <p className="m-0 max-w-[340px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">
            Your professional identity, designed to move with you.
          </p>
        </div>

        <div className="relative flex flex-col">
          {VALUE_PILLARS.map((pillar, i) => (
            <StackCard key={pillar.num} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackCard({ pillar, index }: { pillar: ValuePillar; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const scale = STACK_SCALE[index] ?? 1;

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[680px] rounded-[20px] border border-[rgba(255,255,255,.08)] bg-surface-raised p-[clamp(32px,4vw,48px)] transition-colors duration-500 hover:border-[rgba(253,211,3,.3)] hover:bg-surface-hover"
      style={{
        marginTop: index === 0 ? 0 : -STACK_OVERLAP,
        opacity: visible ? 1 : 0,
        transform: visible ? `scale(${scale})` : `translateY(48px) scale(${scale})`,
        transition: 'opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)',
        boxShadow: index > 0 ? '0 40px 70px -35px rgba(0,0,0,.7)' : undefined,
      }}
    >
      <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">{pillar.num}</div>
      <h3 className="mb-3 mt-11 font-manrope text-[clamp(24px,2.6vw,32px)] font-medium tracking-[-.03em]">
        {pillar.title}
      </h3>
      <p className="m-0 text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">{pillar.body}</p>
    </div>
  );
}
