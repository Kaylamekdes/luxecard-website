import { BULK_DISCOUNT_RATE, BULK_DISCOUNT_THRESHOLD, FINISH_PRICES_BY_LABEL } from '../../api/_lib/pricing';
import { formatKes } from '../utils/formatPrice';
import { ETIMS_INVOICE_TIMEFRAME } from './etims';
import { LINKS } from './links';
import { PRODUCTION_TIMEFRAME } from './production';

export const NAV_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'How It Works', href: '#how' },
  { label: 'For Business', href: '#business' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Become an Affiliate', href: '/affiliate' },
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
  {
    index: '01',
    title: 'Tap / Scan',
    body: 'Tap your LuxeCard on compatible phones (NFC), or scan the QR code to share your contact info.',
  },
  { index: '02', title: 'Open', body: 'Your digital profile opens instantly in their browser. No app needed.' },
  { index: '03', title: 'Connect', body: 'Contact, WhatsApp, socials, website, portfolio: one tap each.' },
  {
    index: '04',
    title: 'Two-Way Exchange',
    body: 'A save-contact prompt appears so they keep your details. They can share theirs back, and you receive it by email.',
  },
];

export const PROBLEM = {
  oldWay: [
    'Paper-based & wasteful',
    'Hand-out networking',
    'Limited information',
    'Requires reprinting',
    'No engagement data',
  ],
  luxeCard: [
    'Reduced paper waste',
    'NFC+QR sharing',
    'Rich digital profile',
    'Update anytime, no reprinting',
    'Track engagement & interactions',
  ],
};

export type ValuePillar = { num: string; title: string; body: string };

export const VALUE_PILLARS: ValuePillar[] = [
  { num: '01', title: 'Your identity', body: 'Everything important about you in one place, and always current.' },
  { num: '02', title: 'Your connections', body: 'Introductions that take a second, not a search for a pen.' },
  { num: '03', title: 'Your opportunities', body: 'Turn real-world conversations into connections that last.' },
];

export type Product = { tag: string; name: string; desc: string; image: string };

export const PRODUCTS: Product[] = [
  { tag: 'TAP PEN', name: 'Tap Pen', desc: 'A pen people keep, and a networking tool they remember.', image: '/images/tap-pen.webp' },
  { tag: 'TAP KEYHOLDER', name: 'Tap Keyholder', desc: 'Your identity on your keys, wherever the day goes.', image: '/images/tap-keyholder.webp' },
  { tag: 'WIFI PASS', name: 'WiFi Pass', desc: 'Guests connect to your network with a tap.', image: '/images/wifi-pass.webp' },
  { tag: 'REVIEW TAP', name: 'Review Tap', desc: 'Turn happy customers into reviews at the counter.', image: '/images/review-tap.webp' },
];

export type CardFinish = {
  name: string;
  price: string;
  blurb: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

// width/height are each image's native pixel size (post-crop) — used as the
// img element's intrinsic aspect ratio so cards of different proportions
// don't stretch or crop against a fixed box.
export const CARD_FINISHES: CardFinish[] = [
  {
    name: "Chairman's Card",
    price: 'KES 19,000',
    blurb: 'Solid gold finish. Reserved for the boldest introductions.',
    image: '/images/card-chairman.webp',
    alt: "LuxeCard in Chairman's Card finish",
    width: 960,
    height: 565,
  },
  {
    name: 'Plastic',
    price: 'KES 7,000',
    blurb: 'Lightweight, durable, and built for everyday carry.',
    image: '/images/card-plastic.webp',
    alt: 'LuxeCard in plastic finish',
    width: 960,
    height: 571,
  },
  {
    name: 'Wood',
    price: 'KES 9,000',
    blurb: 'Naturally lightweight, with a warm, distinctive grain.',
    image: '/images/card-wood.webp',
    alt: 'LuxeCard in wood finish',
    width: 960,
    height: 550,
  },
  {
    name: 'Metallic: Silver & Black',
    price: 'KES 12,000',
    blurb: 'Solid metal weight. A tactile statement piece.',
    image: '/images/card-metallic.webp',
    alt: 'LuxeCard in metallic finish',
    width: 960,
    height: 574,
  },
];

export const PROFESSIONAL_CHIPS = [
  'BANKING & FINANCE',
  'GOVERNMENT',
  'REAL ESTATE',
  'AVIATION',
  'LEGAL',
  'EXECUTIVES & C-SUITE',
];

export type PhotoMaterial = 'plastic' | 'wood' | 'metallic';

export type ProfessionalPhoto = { caption: string; image?: string; alt?: string; material: PhotoMaterial };

// Portfolio photos live in public/images/portfolio/ as <material>-NN.webp
// (square, 800px), numbered from 01. Bump a count here when you add photos.
const PHOTO_COUNTS: Record<PhotoMaterial, number> = { plastic: 13, wood: 14, metallic: 30 };
const MATERIAL_ORDER: PhotoMaterial[] = ['plastic', 'wood', 'metallic'];

function portfolioPhoto(material: PhotoMaterial, n: number): ProfessionalPhoto {
  const id = String(n).padStart(2, '0');
  return {
    caption: `${material.toUpperCase()} ${id}`,
    image: `/images/portfolio/${material}-${id}.webp`,
    alt: `LuxeCard ${material}-finish business card, portfolio example ${n}`,
    material,
  };
}

// Interleaved (plastic, wood, metallic, plastic, ...) so every row of the
// desktop grid mixes finishes; the mobile filter pills pick out one material.
export const PROFESSIONAL_PHOTOS: ProfessionalPhoto[] = Array.from(
  { length: Math.max(...Object.values(PHOTO_COUNTS)) },
  (_, i) => MATERIAL_ORDER.filter((m) => i < PHOTO_COUNTS[m]).map((m) => portfolioPhoto(m, i + 1))
).flat();

export const FOR_BUSINESS_BENEFITS = [
  { title: 'Consistent branding', body: 'Every profile on brand, every time.' },
  { title: 'Team profiles', body: 'Add, edit and retire members centrally.' },
  { title: 'Bulk deployment', body: 'One order, cards for the whole floor.' },
  { title: 'Event-ready', body: 'Capture contacts at conferences and activations.' },
];

// `group` labels the section a question sits under; the accordion prints a
// small heading whenever it changes. "{contact}" inside an answer becomes a
// "Contact us" link to the site's WhatsApp contact (see FaqAccordion).
export type Faq = { q: string; a: string; group?: string };

const GROUP_ORDERING = 'Ordering and pricing';
const GROUP_BUSINESSES = 'For businesses';
const GROUP_USING = 'Using your card';
const GROUP_AFTER = 'After you buy';

// Prices, finish names and the bulk discount come from the checkout's own
// price list (api/_lib/pricing.ts), so these answers always match what the
// order form shows and what customers are actually charged.
const FINISH_LABELS = Object.keys(FINISH_PRICES_BY_LABEL);
const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const joinList = (items: string[], serialComma: boolean) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')}${serialComma ? ',' : ''} and ${items[items.length - 1]}`;
const FINISH_PRICE_LIST = joinList(
  FINISH_LABELS.map((label) => `${label} ${formatKes(FINISH_PRICES_BY_LABEL[label])}`),
  true
);
const FINISH_NAME_LIST = joinList(FINISH_LABELS, false);
const FINISH_COUNT = NUMBER_WORDS[FINISH_LABELS.length] ?? String(FINISH_LABELS.length);
const BULK_DISCOUNT = `${Math.round(BULK_DISCOUNT_RATE * 100)}% off`;

export const FAQS: Faq[] = [
  {
    group: GROUP_ORDERING,
    q: 'How much does a LuxeCard cost?',
    a: `It depends on the material you choose: ${FINISH_PRICE_LIST}. Ordering more than ${BULK_DISCOUNT_THRESHOLD} cards? You automatically get ${BULK_DISCOUNT} at checkout.`,
  },
  {
    group: GROUP_ORDERING,
    q: 'How do I pay?',
    a: 'Pay securely through Paystack using M-Pesa, M-Pesa Till, Airtel Money or card. You’ll receive a payment receipt by email straight away.',
  },
  {
    group: GROUP_ORDERING,
    q: 'What happens after I order, and how long does it take?',
    a: `Our team will reach out within 24 hours to collect your details and brand assets. We’ll then design your card and share mockups for your review. Once you approve, production takes anywhere from a few hours to ${PRODUCTION_TIMEFRAME}, depending on your design. For large corporate orders, we’ll confirm the timeline with you. Delivery fees vary by location and are paid by you upon arrival, except for the Chairman’s Card, where LuxeCard covers all transport costs.`,
  },
  {
    group: GROUP_ORDERING,
    q: 'Who designs my card, and can I customise it?',
    a: `We do. Share your details and brand assets (logo, colours, name and title), and we’ll design your LuxeCard to your specifications, then share mockups for your review and approval before anything goes into production. Choose from ${FINISH_COUNT} materials: ${FINISH_NAME_LIST}.`,
  },
  {
    group: GROUP_BUSINESSES,
    q: 'Can businesses get LuxeCards for their teams?',
    a: `Yes. Choose “For teams” when ordering to add cards for your whole team in one order, with ${BULK_DISCOUNT} when you order more than ${BULK_DISCOUNT_THRESHOLD} cards.`,
  },
  {
    group: GROUP_BUSINESSES,
    q: 'Do you provide eTIMS tax invoices?',
    a: `Yes. On a “For teams” order, tick “I need an eTIMS tax invoice” and enter your KRA PIN and registered business name. Your eTIMS invoice will be emailed within ${ETIMS_INVOICE_TIMEFRAME} of payment. Need a quotation first for internal approval? {contact} and we’ll send one.`,
  },
  {
    group: GROUP_USING,
    q: 'How does it work? Do I need an app?',
    a: 'No app needed, for you or the person you’re sharing with. Tap your card on their phone and your digital profile opens instantly in their browser, ready to save your contact details.',
  },
  {
    group: GROUP_USING,
    q: 'Which phones does it work with?',
    a: 'Most modern smartphones read LuxeCard with a simple tap: iPhone XR and newer, and most Android phones with NFC switched on. If a phone doesn’t support tapping, they can scan the QR code on your card instead.',
  },
  {
    group: GROUP_USING,
    q: 'How many cards do I need?',
    a: 'Just one, unless you’re ordering for a team. Your card comes with a full digital profile that you can save to your phone’s home screen, so it’s always with you, even when the physical card isn’t in your pocket. Whenever you need to share your contact, simply show the QR code on your digital card.',
  },
  {
    group: GROUP_USING,
    q: 'Can I update what’s on my profile?',
    // Merges the original "Can I update my information after getting my
    // card?" and "What can I include on my digital profile?" answers.
    a: 'Yes. Your profile can include your name, title, company, a short introduction, contact details, WhatsApp, socials, website, portfolio and other links. Change your details, links or photo any time, and your card keeps pointing to your current profile.',
  },
  {
    group: GROUP_AFTER,
    q: 'Are there any monthly or yearly fees?',
    a: 'No. Each LuxeCard is a one-off payment, with no subscriptions or recurring fees.',
  },
];

export type Testimonial = { quote: string; name: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Got amazing smart business cards for my team and I. My networking game just moved a notch higher with executives I interact with this days. Excellent customer experience as well.',
    name: 'Lyban Mbatha',
  },
  {
    quote: 'Amazing and professional service all through. I would highly recommend them to anyone seeking this service.',
    name: 'CR Advocates LLP',
  },
  { quote: 'The Metal is of very high quality. Highly recommend to others.', name: 'Chirag Solanki' },
  { quote: 'The design is clean and premium and the purchase experience was excellent.', name: 'K. Keli' },
  { quote: 'I paid and got it same day. Great service. Love the design.', name: 'Chizaram Ucheaga' },
  { quote: 'The cards are as good in person as they look on video.', name: 'Stanley Juma' },
];

export const FOOTER_LINKS = {
  columnOne: { title: 'Explore', links: NAV_LINKS },
  columnTwo: {
    title: 'Connect',
    links: [
      { label: 'Contact', href: LINKS.CONTACT },
      { label: 'Instagram', href: LINKS.SOCIAL.instagram },
      { label: 'LinkedIn', href: LINKS.SOCIAL.linkedin },
      { label: 'Facebook', href: LINKS.SOCIAL.facebook },
      { label: 'TikTok', href: LINKS.SOCIAL.tiktok },
      { label: 'YouTube', href: LINKS.SOCIAL.youtube },
    ],
  },
  columnThree: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: LINKS.LEGAL.terms },
      { label: 'Privacy and Data Protection', href: LINKS.LEGAL.privacy },
      { label: 'Return Policy', href: LINKS.LEGAL.returns },
    ],
  },
};
