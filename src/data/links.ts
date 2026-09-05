const WHATSAPP_NUMBER = '254729728339'; // +254 729 728339
const WHATSAPP_MESSAGE = "Hi, I'm interested in getting a LuxeCard";

export const LINKS = {
  ORDER: '#get', // TODO: LuxeCard order/checkout URL
  BUSINESS: '#business', // TODO: team/enterprise enquiry flow
  CONTACT: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  SOCIAL: {
    instagram: '#get', // TODO
    linkedin: '#get', // TODO
  },
  LEGAL: {
    privacy: '#get', // TODO
    terms: '#get', // TODO
  },
} as const;
