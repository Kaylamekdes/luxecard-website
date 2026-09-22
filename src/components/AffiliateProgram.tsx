import { AffiliateCommissionMoment } from './AffiliateCommissionMoment';
import { AffiliateFaqSection } from './AffiliateFaqSection';
import { AffiliateHero } from './AffiliateHero';
import { AffiliateHowItWorks } from './AffiliateHowItWorks';
import { AffiliateLinkJourney } from './AffiliateLinkJourney';
import { AffiliateSignupForm } from './AffiliateSignupForm';

export function AffiliateProgram() {
  return (
    <main className="pt-[var(--nav-h)]">
      <AffiliateHero />
      <AffiliateHowItWorks />
      <AffiliateCommissionMoment />
      <AffiliateLinkJourney />
      <AffiliateSignupForm />
      <AffiliateFaqSection />
    </main>
  );
}
