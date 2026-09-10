import { useEffect, useRef } from 'react';
import { RevealSection } from './RevealSection';

const WIDGET_ID = 'JFWebsiteWidget-01a08af97f5070008102110c5e6313a9a819';
const WIDGET_SRC = 'https://www.jotform.com/website-widgets/embed/01a08af97f5070008102110c5e6313a9a819';

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.querySelectorAll('script').forEach((el) => el.remove());
    };
  }, []);

  return (
    <RevealSection
      id="testimonials"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] text-center min-[900px]:scroll-mt-[96px]"
    >
      <div className="mx-auto max-w-[1000px]">
        <h2 className="m-0 mb-[clamp(36px,5vh,60px)] font-manrope text-[clamp(32px,4.4vw,58px)] font-bold leading-[.98] tracking-[-.032em]">
          REAL REVIEWS.
          <br />
          REAL CONNECTIONS.
        </h2>
        <div id={WIDGET_ID} ref={containerRef} />
      </div>
    </RevealSection>
  );
}
