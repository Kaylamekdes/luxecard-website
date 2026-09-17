import type { ReactNode } from 'react';
import { CartProvider } from './components/CartProvider';
import { ContactVisit } from './components/ContactVisit';
import { useCart } from './context/cartContext';
import { Ecosystem } from './components/Ecosystem';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { ForBusiness } from './components/ForBusiness';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { InquiryModalProvider } from './components/InquiryModalProvider';
import { Nav } from './components/Nav';
import { NetworkingMoment } from './components/NetworkingMoment';
import { Problem } from './components/Problem';
import { Professionals } from './components/Professionals';
import { SmoothScroll } from './components/SmoothScroll';
import { Testimonials } from './components/Testimonials';
import { WhatsAppButton } from './components/WhatsAppButton';

// Nav and WhatsAppButton are fixed-position and blur themselves directly
// (a filtered ancestor would change their containing block and break that
// fixed positioning). Everything else — ordinary flow content — can be
// blurred as a group here instead.
function BlurredContent({ children }: { children: ReactNode }) {
  const { isOpen } = useCart();
  return <div style={{ filter: isOpen ? 'blur(18px)' : 'none' }}>{children}</div>;
}

function App() {
  return (
    <div style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      <CartProvider>
        <InquiryModalProvider>
          <SmoothScroll />
          <Nav />
          <BlurredContent>
            <main className="pt-[84px] min-[900px]:pt-[80px]">
              <Hero />
              <HowItWorks />
              <Problem />
              <Ecosystem />
              <Professionals />
              <NetworkingMoment />
              <ForBusiness />
              <Testimonials />
              <Faq />
              <ContactVisit />
            </main>
            <Footer />
          </BlurredContent>
          <WhatsAppButton />
        </InquiryModalProvider>
      </CartProvider>
    </div>
  );
}

export default App;
