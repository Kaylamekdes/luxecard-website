export type AffiliateStep = { index: string; title: string; body: string };

export const AFFILIATE_STEPS: AffiliateStep[] = [
  { index: '01', title: 'Sign Up', body: 'Join in seconds with the form below.' },
  { index: '02', title: 'Get Your Unique Link', body: 'Get a personal link to share.' },
  { index: '03', title: 'Earn 10% On Every Sale', body: 'Earn 10% when they buy, automatically.' },
];

export type AffiliateFaq = { q: string; a: string };

export const AFFILIATE_FAQS: AffiliateFaq[] = [
  {
    q: 'How do I get my referral link?',
    a: "Once you sign up, our team will create and send you your unique referral link within a few hours.",
  },
  {
    q: 'Can I share my link anywhere?',
    a: 'Yes, share it on social media, WhatsApp, email, or anywhere your audience can see it.',
  },
  {
    q: 'How much commission do I earn?',
    a: 'You earn 10% commission on every order placed through your unique referral link.',
  },
  {
    q: 'What if a referred order is cancelled or refunded?',
    a: 'Commission is only paid on completed, non-refunded orders.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Commissions are paid out monthly via M-Pesa or bank transfer, based on completed orders made through your link.',
  },
  {
    q: 'Is there a minimum payout?',
    a: "No minimum — you receive whatever you've earned each payout cycle.",
  },
  {
    q: 'Who can join the affiliate program?',
    a: 'Anyone can join — there are no eligibility requirements. Just sign up with the form on this page to get started.',
  },
];
