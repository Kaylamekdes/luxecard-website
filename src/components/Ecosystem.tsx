import { PRODUCTS } from '../data/content';
import { LINKS } from '../data/links';
import { RevealSection } from './RevealSection';

export function Ecosystem() {
  return (
    <RevealSection
      id="products"
      className="scroll-mt-[68px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]"
    >
      <div className="mx-auto max-w-[1320px]">
        <h2 className="m-0 mb-[clamp(44px,6vh,72px)] font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
          ONE ECOSYSTEM.
          <br />
          ENDLESS WAYS TO CONNECT.
        </h2>

        <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' }}>
          {/* hero product */}
          <div
            className="group relative row-span-2 flex min-h-[clamp(400px,52vh,560px)] flex-col justify-between overflow-hidden rounded-[20px] border border-[rgba(255,255,255,.08)] p-[clamp(28px,3vw,44px)] transition-colors duration-500 hover:border-[rgba(253,211,3,.34)]"
            style={{ background: 'radial-gradient(110% 80% at 70% 20%, #17171B, #0B0B0D 65%)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">THE ORIGINAL</div>
                <h3 className="mt-3.5 font-manrope text-[clamp(30px,3.6vw,46px)] font-semibold tracking-[-.03em]">
                  LuxeCard
                </h3>
              </div>
              <span className="font-inter text-[10px] font-medium tracking-[.13em] text-grey-1">NFC + QR</span>
            </div>
            <div className="flex flex-1 items-center justify-center py-6">
              <div
                className="animate-lc-float flex aspect-[1.6] w-[min(340px,80%)] flex-col justify-between rounded-2xl border p-5"
                style={{
                  background: 'linear-gradient(132deg, #2A2A30 0%, #101013 46%, #1A1A1F 100%)',
                  borderColor: 'rgba(255,255,255,.11)',
                  boxShadow: '0 50px 90px -40px rgba(0,0,0,.95), inset 0 1px 0 rgba(255,255,255,.09)',
                }}
              >
                <div className="font-manrope text-[16px] font-semibold tracking-[-.02em]">LuxeCard</div>
                <div className="font-inter text-[8.5px] font-medium tracking-[.13em] text-grey-1">
                  ONE TAP. EVERYTHING YOU.
                </div>
              </div>
            </div>
            <div>
              <p className="m-0 mb-5 max-w-[420px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.55)]">
                Your digital business card. Matte, metal-feel, tactile — and it never goes out of date.
              </p>
              <a
                href={LINKS.ORDER}
                className="inline-flex items-center gap-2.5 text-[14.5px] text-ivory opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              >
                Get Your LuxeCard <span className="font-inter">→</span>
              </a>
            </div>
          </div>

          {/* supporting products */}
          <div className="grid content-start gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}>
            {PRODUCTS.map((product) => (
              <div
                key={product.tag}
                className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[18px] border border-[rgba(255,255,255,.07)] bg-surface p-[26px] transition-[border-color,transform] duration-500 hover:-translate-y-1.5 hover:border-[rgba(253,211,3,.32)]"
              >
                <div className="font-inter text-[9.5px] font-medium tracking-[.14em] text-grey-1">{product.tag}</div>
                <div className="flex flex-1 items-center justify-center py-4">
                  <div
                    className="flex h-[78px] w-full items-center justify-center rounded-xl border border-[rgba(255,255,255,.05)] px-3 text-center font-inter text-[8.5px] tracking-[.12em] text-grey-1"
                    style={{ background: 'repeating-linear-gradient(45deg, #16161B 0 10px, #111116 10px 20px)' }}
                  >
                    {product.slot}
                  </div>
                </div>
                <div>
                  <h3 className="m-0 font-manrope text-[22px] font-medium tracking-[-.03em]">{product.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.55] text-[rgba(243,240,234,.5)] opacity-40 transition-opacity duration-500 group-hover:opacity-100">
                    {product.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
