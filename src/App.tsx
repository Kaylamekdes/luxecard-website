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

// Nav is fixed-position and blurs itself directly for the cart (a filtered
// ancestor would change its containing block and break that fixed
// positioning) but deliberately stays sharp for its own mobile menu, since
// the menu panel is rendered inside it. WhatsAppButton blurs for both.
// Everything else — ordinary flow content — is blurred as a group here.
function BlurredContent({ children }: { children: ReactNode }) {
  const { isOpen: cartOpen } = useCart();
  const { isOpen: menuOpen } = useNavMenu();
  return (
    <div
      style={{
        filter: cartOpen || menuOpen ? 'blur(18px)' : 'none',
        transition: 'filter 550ms cubic-bezier(.65,0,.35,1)',
      }}
    >
      {children}
    </div>
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
