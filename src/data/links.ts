const WHATSAPP_NUMBER = '254729728339'; // +254 729 728339
const WHATSAPP_MESSAGE = "Hi, I'm interested in getting a LuxeCard";
const EMAIL = 'luxecardke@gmail.com';

export const LINKS = {
  ORDER: '#get', // TODO: LuxeCard order/checkout URL
  BUSINESS: '#business', // TODO: team/enterprise enquiry flow
  CONTACT: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  PHONE_DISPLAY: '+254 729 728339',
  PHONE_TEL: `tel:+${WHATSAPP_NUMBER}`,
  EMAIL,
  EMAIL_MAILTO: `mailto:${EMAIL}`,
  ADDRESS: '124 Manyani East Road, Lavington, Nairobi',
  MAP_EMBED_SRC: 'https://www.google.com/maps?q=124+Manyani+East+Road,+Lavington,+Nairobi&output=embed',
  SOCIAL: {
    instagram: 'https://www.instagram.com/luxecard_africa/',
    linkedin: '#get', // TODO
  },
  LEGAL: {
    privacy: '#get', // TODO
    terms: '#get', // TODO
  },
} as const;
