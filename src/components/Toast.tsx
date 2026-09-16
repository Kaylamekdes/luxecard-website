export function Toast({ message, description }: { message: string | null; description?: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed inset-x-0 bottom-8 z-[220] flex justify-center px-4 transition-[opacity,transform] duration-300 ease-lux"
      style={{
        opacity: message ? 1 : 0,
        transform: message ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: 'none',
      }}
    >
      {message && (
        <div className="max-w-[360px] rounded-2xl border border-[rgba(255,255,255,.14)] bg-[#141416] px-6 py-4 text-center shadow-2xl">
          <div className="text-[14px] font-medium text-ivory">{message}</div>
          {description && (
            <div className="mt-1 text-[12.5px] leading-[1.4] text-[rgba(243,240,234,.55)]">{description}</div>
          )}
        </div>
      )}
    </div>
  );
}
