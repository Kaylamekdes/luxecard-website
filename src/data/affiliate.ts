export type AffiliateStep = { index: string; title: string; body: string };

export const AFFILIATE_STEPS: AffiliateStep[] = [
  { index: '01', title: 'Sign Up', body: 'Fill out the quick form below to join the LuxeCard Affiliate Program.' },
  {
    index: '02',
    title: 'Get Your Unique Link',
    body: 'We set you up with a personal referral link to share with your network.',
  },
  {
    index: '03',
    title: 'Earn 10% On Every Sale',
    body: 'Every order placed through your link earns you a 10% commission, tracked automatically.',
  },
];

export type AffiliateFaq = { q: string; a: string };

export const AFFILIATE_FAQS: AffiliateFaq[] = [
  {
    q: 'How do I get my referral link?',
    a: 'CONTENT NEEDED: describe how affiliates receive their unique referral link once the tracking system is live.',
  },
  {
    q: 'How much commission do I earn?',
    a: 'You earn 10% commission on every order placed through your unique referral link.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'CONTENT NEEDED: confirm the payout schedule and payment method (e.g. M-Pesa, bank transfer).',
  },
  {
    q: 'Is there a minimum payout?',
    a: 'CONTENT NEEDED: confirm whether a minimum balance is required before payout.',
  },
  {
    q: 'Who can join the affiliate program?',
    a: 'CONTENT NEEDED: confirm any eligibility requirements for joining.',
  },
];
