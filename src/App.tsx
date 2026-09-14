import { BusinessInquiryModalProvider } from './components/BusinessInquiryModalProvider';
import { ContactVisit } from './components/ContactVisit';
import { CreateCardModalProvider } from './components/CreateCardModalProvider';
import { Ecosystem } from './components/Ecosystem';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { ForBusiness } from './components/ForBusiness';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Nav } from './components/Nav';
import { NetworkingMoment } from './components/NetworkingMoment';
import { Problem } from './components/Problem';
import { Professionals } from './components/Professionals';
import { SmoothScroll } from './components/SmoothScroll';
import { Testimonials } from './components/Testimonials';
import { WhatsAppButton } from './components/WhatsAppButton';

function App() {
  return (
    <div style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      <CreateCardModalProvider>
        <BusinessInquiryModalProvider>
          <SmoothScroll />
          <Nav />
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
          <WhatsAppButton />
        </BusinessInquiryModalProvider>
      </CreateCardModalProvider>
    </div>
  );
}

export default App;
