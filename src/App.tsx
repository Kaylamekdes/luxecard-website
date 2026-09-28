import type { ReactNode } from 'react';
import { AffiliateProgram } from './components/AffiliateProgram';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './components/CartProvider';
import { ContactModalProvider } from './components/ContactModalProvider';
import { ContactVisit } from './components/ContactVisit';
import { CookieBanner } from './components/CookieBanner';
import { useCart } from './context/cartContext';
import { useNavMenu } from './context/navMenuContext';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Ecosystem } from './components/Ecosystem';
import { Faq } from './components/Faq';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { ForBusiness } from './components/ForBusiness';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LegalPage } from './components/LegalPage';
import { LEGAL_DOCS } from './data/legal';
import { InquiryModalProvider } from './components/InquiryModalProvider';
import { Nav } from './components/Nav';
import { NavMenuProvider } from './components/NavMenuProvider';
import { NetworkingMoment } from './components/NetworkingMoment';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Problem } from './components/Problem';
import { Professionals } from './components/Professionals';
import { SmoothScroll } from './components/SmoothScroll';
import { Testimonials } from './components/Testimonials';
import { WhatsAppButton } from './components/WhatsAppButton';

// Nav dims itself directly for the cart, but deliberately stays at full
// opacity for its own mobile menu, since the menu panel is rendered inside
// it. WhatsAppButton dims for both. Everything else — ordinary flow content
// — gets a fixed overlay laid over it here: a frosted dark glass pane, the
// same look the original `filter: blur()` on the content itself had, but far
// cheaper. The blur radius is a constant, never itself transitioned — only
// this pane's opacity animates, so opening/closing never asks the browser to
// recompute the blur at a series of intermediate radii, only to fade a
// backdrop that's already blurred at a fixed strength.
function BlurredContent({ children }: { children: ReactNode }) {
  const { isOpen: cartOpen } = useCart();
  const { isOpen: menuOpen } = useNavMenu();
  const dimmed = cartOpen || menuOpen;
  return (
    <>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85]"
        style={{
          background: 'rgba(4,4,6,.4)',
          backdropFilter: 'blur(18px)',
          opacity: dimmed ? 1 : 0,
          visibility: dimmed ? 'visible' : 'hidden',
          transition: `opacity 550ms cubic-bezier(.65,0,.35,1), visibility 0s linear ${dimmed ? '0s' : '550ms'}`,
        }}
      />
    </>
  );
}

// True once per full page load; navigation to/from these paths is a plain
// browser navigation (no client router), so neither needs to be reactive.
const isAffiliatePage = window.location.pathname.replace(/\/$/, '') === '/affiliate';
const isOrderConfirmationPage = window.location.pathname.replace(/\/$/, '') === '/order-confirmation';
const legalDoc = LEGAL_DOCS.find((d) => d.path === window.location.pathname.replace(/\/$/, ''));

function App() {
  // On phones "Trusted Across Industries" comes before "Digitizing Networking
  // Across Africa"; on larger screens the order is the other way round. Same
  // breakpoint as the portfolio's own mobile layout.
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isOrderConfirmationPage) {
    return (
      <>
        <OrderConfirmation />
        <CookieBanner />
      </>
    );
  }

  return (
    <div style={{ overflowX: 'clip', background: 'var(--bg-base)' }}>
      <NavMenuProvider>
        <CartProvider>
          <InquiryModalProvider>
            <ContactModalProvider>
              <SmoothScroll />
              <Nav />
              <BlurredContent>
                {legalDoc ? (
                  <LegalPage doc={legalDoc} />
                ) : isAffiliatePage ? (
                  <AffiliateProgram />
                ) : (
                  <main className="pt-[var(--nav-h)]">
                    <Hero />
                    <Testimonials />
                    <Ecosystem />
                    <HowItWorks />
                    {isMobile ? (
                      <>
                        <Professionals />
                        <Problem />
                      </>
                    ) : (
                      <>
                        <Problem />
                        <Professionals />
                      </>
                    )}
                    <NetworkingMoment />
                    <ForBusiness />
                    <Faq />
                    <FinalCta />
                    <ContactVisit />
                  </main>
                )}
                <Footer />
              </BlurredContent>
              <WhatsAppButton />
              <CookieBanner />
              <CartDrawer />
            </ContactModalProvider>
          </InquiryModalProvider>
        </CartProvider>
      </NavMenuProvider>
    </div>
  );
}

export default App;
