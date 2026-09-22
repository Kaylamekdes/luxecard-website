import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface BorderGlowProps {
  children: ReactNode;
  borderRadius?: string;
  duration?: number;
  borderWidth?: string;
}

export function BorderGlow({
  children,
  borderRadius = '22px',
  duration = 4,
  borderWidth = '1.5px',
}: BorderGlowProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative overflow-hidden" style={{ borderRadius }}>
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, transparent 280deg, #FF6B00 310deg, #FF007A 335deg, #00F0FF 360deg)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: borderWidth,
            borderRadius,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
