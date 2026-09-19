export function parsePrice(priceLabel: string): number {
  return Number(priceLabel.replace(/[^\d]/g, ''));
}

export function formatKes(value: number): string {
  return `KES ${Math.round(value).toLocaleString()}`;
}
