import { LINKS } from '../data/links';
import { RevealSection } from './RevealSection';

export function ContactVisit() {
  return (
    <RevealSection
      id="contact"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[96px]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-[clamp(32px,5vw,64px)] md:grid-cols-2 md:items-center">
          <div>
            <h2 className="m-0 mb-[clamp(28px,4vh,40px)] font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
              CONTACT
              <br />
              &amp; VISIT US.
            </h2>

            <div className="hidden flex-col gap-7 md:flex">
              <div>
                <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">ADDRESS</div>
                <p className="m-0 mt-2 max-w-[320px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.7)]">
                  {LINKS.ADDRESS}
                </p>
              </div>
              <div>
                <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">PHONE</div>
                <a
                  href={LINKS.PHONE_TEL}
                  className="mt-2 block text-[16.5px] text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:text-accent"
                >
                  {LINKS.PHONE_DISPLAY}
                </a>
              </div>
              <div>
                <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">EMAIL</div>
                <a
                  href={LINKS.EMAIL_MAILTO}
                  className="mt-2 block text-[16.5px] text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:text-accent"
                >
                  {LINKS.EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[rgba(255,255,255,.08)]">
            <iframe
              title="LuxeCard location on Google Maps"
              src={LINKS.MAP_EMBED_SRC}
              className="h-[280px] w-full md:h-[420px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
