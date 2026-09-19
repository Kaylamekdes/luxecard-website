import { AffiliateCommissionMoment } from './AffiliateCommissionMoment';
import { AffiliateFaqSection } from './AffiliateFaqSection';
import { AffiliateHero } from './AffiliateHero';
import { AffiliateHowItWorks } from './AffiliateHowItWorks';
import { AffiliateLinkJourney } from './AffiliateLinkJourney';
import { AffiliateSignupForm } from './AffiliateSignupForm';

export function AffiliateProgram() {
  return (
    <main className="pt-[84px] min-[900px]:pt-[80px]">
      <AffiliateHero />
      <AffiliateHowItWorks />
      <AffiliateCommissionMoment />
      <AffiliateLinkJourney />
      <AffiliateSignupForm />
      <AffiliateFaqSection />
    </main>
  );
}
