import { AffiliateCommissionMoment } from './AffiliateCommissionMoment';
import { AffiliateFaqSection } from './AffiliateFaqSection';
import { AffiliateHero } from './AffiliateHero';
import { AffiliateHowItWorks } from './AffiliateHowItWorks';
import { AffiliateSignupForm } from './AffiliateSignupForm';
import { AffiliateTapShare } from './AffiliateTapShare';

export function AffiliateProgram() {
  return (
    <main className="pt-[84px] min-[900px]:pt-[80px]">
      <AffiliateHero />
      <AffiliateHowItWorks />
      <AffiliateCommissionMoment />
      <AffiliateTapShare />
      <AffiliateSignupForm />
      <AffiliateFaqSection />
    </main>
  );
}
