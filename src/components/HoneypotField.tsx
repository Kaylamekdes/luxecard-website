import { HONEYPOT_NAME } from '../utils/honeypot';

export function HoneypotField() {
  return (
    <input
      type="text"
      name={HONEYPOT_NAME}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      defaultValue=""
      className="pointer-events-none absolute h-0 w-0 opacity-0"
    />
  );
}
