const WHATSAPP_NUMBER = '254729728339'; // +254 729 728339
const WHATSAPP_MESSAGE = "Hi, I'm interested in getting a LuxeCard";
const EMAIL = 'sales@luxecard.co.ke';

export const LINKS = {
  ORDER: '#get', // TODO: LuxeCard order/checkout URL
  BUSINESS: '#business', // TODO: team/enterprise enquiry flow
  CONTACT: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  PHONE_DISPLAY: '+254 729 728339',
  PHONE_TEL: `tel:+${WHATSAPP_NUMBER}`,
  PHONE2_DISPLAY: '+254 142 492026',
  PHONE2_TEL: 'tel:+254142492026',
  EMAIL,
  EMAIL_MAILTO: `mailto:${EMAIL}`,
  ADDRESS: '124 Manyani East Road, Nairobi',
  MAP_EMBED_SRC: 'https://www.google.com/maps?q=-1.261213,36.7711506&output=embed',
  SOCIAL: {
    instagram: 'https://www.instagram.com/luxecard_africa/',
    linkedin: '#get', // TODO
    facebook: '#get', // TODO
  },
  LEGAL: {
    privacy: '#get', // TODO
    terms: '#get', // TODO
  },
} as const;
