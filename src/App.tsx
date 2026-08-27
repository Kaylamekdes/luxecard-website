import { AfterTheTap } from './components/AfterTheTap';
import { Ecosystem } from './components/Ecosystem';
import { Faq } from './components/Faq';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { ForBusiness } from './components/ForBusiness';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Nav } from './components/Nav';
import { NetworkingMoment } from './components/NetworkingMoment';
import { Problem } from './components/Problem';
import { Professionals } from './components/Professionals';
import { SmoothScroll } from './components/SmoothScroll';
import { Value } from './components/Value';

function App() {
  return (
    <div style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      <SmoothScroll />
      <Nav />
      <main className="pt-[84px] min-[900px]:pt-[96px]">
        <Hero />
        <HowItWorks />
        <Problem />
        <Value />
        <Ecosystem />
        <Professionals />
        <NetworkingMoment />
        <AfterTheTap />
        <ForBusiness />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

export default App;
