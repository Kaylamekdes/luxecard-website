import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { useReveal } from '../hooks/useReveal';

type RevealSectionProps = ComponentPropsWithoutRef<'section'>;

export const RevealSection = forwardRef<HTMLElement, RevealSectionProps>(function RevealSection(
  { style, ...rest },
  forwardedRef
) {
  const { ref, style: revealStyle } = useReveal<HTMLElement>();

  return (
    <section
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      style={{ ...revealStyle, ...style }}
      {...rest}
    />
  );
});
