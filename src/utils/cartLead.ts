export type CartLeadPayload = {
  type: 'individual' | 'business';
  fullName: string;
  jobTitle?: string;
  company?: string;
  email: string;
  phone: string;
  items: { name: string; subOption?: string; quantity: number }[];
  message?: string;
  hp: string;
};

// Records an add-to-cart submission. Deliberately fire-and-forget: adding to
// the cart must always work, so a failed save is only logged (the server logs
// its own failures too), never shown to the customer.
export function sendCartLead(payload: CartLeadPayload) {
  fetch('/api/cart-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) console.error(`Cart lead was not saved (server returned ${res.status}).`);
    })
    .catch((err) => console.error('Cart lead was not saved:', err));
}
