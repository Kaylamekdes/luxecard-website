import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useLiquidBorder } from '../hooks/useLiquidBorder';

const RING_GRADIENT =
  'conic-gradient(from var(--angle, 0deg), transparent 0deg, transparent 248deg, rgba(255,244,214,.85) 280deg, #FFFDF5 300deg, #FDD303 316deg, rgba(253,211,3,.35) 338deg, transparent 356deg, transparent 360deg)';

/**
 * Wraps a pill-shaped CTA with a thin metallic ring, outside the button's
 * own edge, whose bright point sweeps continuously clockwise (see
 * useLiquidBorder) leaving a tapering gold trail — a glossy, reflective
 * rim rather than a static border.
 */
export function LiquidMetalButton({
  href,
  className,
  style,
  children,
  ...rest
}: {
  href: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ringRef = useLiquidBorder<HTMLSpanElement>(65);

  return (
    <span className="relative inline-block rounded-full p-[2px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          padding: '2px',
          background: 'rgba(255,255,255,.22)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <span
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          padding: '2px',
          background: RING_GRADIENT,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <a href={href} className={`relative z-[1] ${className}`} style={style} {...rest}>
        {children}
      </a>
    </span>
  );
}
