import { LINKS } from './links';

export const NAV_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'How It Works', href: '#how' },
  { label: 'For Business', href: '#business' },
  { label: 'FAQs', href: '#faqs' },
] as const;

export const DEMO_PROFILE = {
  name: 'Wanjiru Kamau',
  title: 'Brand Strategist, Meridian',
} as const;

export const HERO_TRUST = ['NFC + QR', 'NO APP TO VIEW', 'UPDATE ANYTIME'] as const;

export type Stage = {
  index: string;
  title: string;
  body: string;
};

export const STAGES: Stage[] = [
  { index: '01', title: 'Tap', body: 'Hold your LuxeCard against any phone. No app, no setup, no fumbling.' },
  { index: '02', title: 'Open', body: 'Your digital profile appears instantly, in their browser.' },
  { index: '03', title: 'Connect', body: 'Contact, WhatsApp, socials, website, portfolio — one tap each.' },
  { index: '04', title: 'Follow up', body: 'The connection stays after the conversation ends.' },
];

export const PROBLEM = {
  oldWay: ['Paper card.', 'Given away.', 'Put in a pocket.', 'Forgotten.', 'Lost.'],
  luxeCard: ['Tap.', 'Profile opens.', 'Contact saved.', 'Connection continues.', 'Still there next year.'],
};

export type ValuePillar = { num: string; title: string; body: string };

export const VALUE_PILLARS: ValuePillar[] = [
  { num: '01', title: 'Your identity', body: 'Everything important about you in one place — and current, always.' },
  { num: '02', title: 'Your connections', body: 'Introductions that take a second, not a search for a pen.' },
  { num: '03', title: 'Your opportunities', body: 'Turn real-world conversations into connections that last.' },
];

export type Product = { tag: string; name: string; desc: string; image: string };

export const PRODUCTS: Product[] = [
  { tag: 'TAP PEN', name: 'Tap Pen', desc: 'A pen people keep — and a networking tool they remember.', image: '/images/tap-pen.webp' },
  { tag: 'TAP KEYHOLDER', name: 'Tap Keyholder', desc: 'Your identity on your keys, wherever the day goes.', image: '/images/tap-keyholder.webp' },
  { tag: 'WIFI PASS', name: 'WiFi Pass', desc: 'Guests connect to your network with a tap.', image: '/images/wifi-pass.webp' },
  { tag: 'REVIEW TAP', name: 'Review Tap', desc: 'Turn happy customers into reviews at the counter.', image: '/images/review-tap.webp' },
];

export type CardFinish = { name: string; price: string; image: string; alt: string };

export const CARD_FINISHES: CardFinish[] = [
  { name: 'Plastic', price: 'KES 6,000', image: '/images/card-plastic.webp', alt: 'LuxeCard in plastic finish' },
  { name: 'Wood', price: 'KES 7,000', image: '/images/card-wood.webp', alt: 'LuxeCard in wood finish' },
  { name: 'Metallic', price: 'KES 10,000', image: '/images/card-metallic.webp', alt: 'LuxeCard in metallic finish' },
];

export const PROFESSIONAL_CHIPS = ['CONFERENCES', 'CLIENT MEETINGS', 'SALES', 'CREATIVE', 'FOUNDERS', 'CONSULTANTS'];

export type ProfessionalPhoto = { caption: string; image?: string; alt?: string };

export const PROFESSIONAL_PHOTOS: ProfessionalPhoto[] = [
  {
    caption: 'PHOTO — EXECUTIVE, TAILORED SUIT,\nWESTLANDS ROOFTOP, EVENING LIGHT',
  },
  {
    caption: 'PHOTO — TWO PROFESSIONALS,\nCARD TAP CLOSE-UP, HANDS IN FRAME',
  },
  {
    caption: 'PHOTO — CREATIVE DIRECTOR,\nSTUDIO, CANDID, DEPTH OF FIELD',
  },
];

export const AFTER_THE_TAP = [
  { num: '01', label: 'Tap' },
  { num: '02', label: 'Profile opened' },
  { num: '03', label: 'Connection' },
  { num: '04', label: 'Follow-up' },
  { num: '05', label: 'Opportunity' },
];

export const FOR_BUSINESS_BENEFITS = [
  { title: 'Consistent branding', body: 'Every profile on brand, every time.' },
  { title: 'Team profiles', body: 'Add, edit and retire members centrally.' },
  { title: 'Bulk deployment', body: 'One order, cards for the whole floor.' },
  { title: 'Event-ready', body: 'Capture contacts at conferences and activations.' },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  { q: 'Do I need an app to use LuxeCard?', a: 'No. You manage your profile in the browser, and the person you tap just sees a web page — nothing to install on either side.' },
  { q: 'Does the other person need NFC?', a: 'Most modern smartphones read NFC without any setup. If theirs does not, the QR code on your card does the same job.' },
  { q: 'Can I use QR if their phone doesn’t support NFC?', a: 'Yes. Every LuxeCard carries a QR code that opens the same profile.' },
  { q: 'Can I update my information after getting my card?', a: 'Yes. Change your details, links or photo any time — the card keeps pointing to your current profile.' },
  { q: 'What can I include on my digital profile?', a: 'Name, title, company, a short introduction, contact details, WhatsApp, socials, website, portfolio and other links.' },
  { q: 'Can businesses get LuxeCards for their teams?', a: 'Yes. Teams can be equipped with branded cards and profiles managed together.' },
  { q: 'Can I use LuxeCard internationally?', a: 'Yes. NFC and QR work the same anywhere, and your profile is a link — no region limits.' },
  { q: 'How does the physical card work?', a: 'A chip inside the card carries a link to your profile. Holding it near a phone opens that link; the QR code does the same by camera.' },
];

export const FOOTER_LINKS = {
  columnOne: NAV_LINKS,
  columnTwo: [
    { label: 'Contact', href: LINKS.CONTACT },
    { label: 'Instagram', href: LINKS.SOCIAL.instagram },
    { label: 'LinkedIn', href: LINKS.SOCIAL.linkedin },
  ],
  columnThree: [
    { label: 'Privacy', href: LINKS.LEGAL.privacy },
    { label: 'Terms', href: LINKS.LEGAL.terms },
  ],
};
