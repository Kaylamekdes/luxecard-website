export function Toast({ message }: { message: string | null }) {
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
        <div className="rounded-full border border-[rgba(255,255,255,.14)] bg-[#141416] px-6 py-3 text-[14px] font-medium text-ivory shadow-2xl">
          {message}
        </div>
      )}
    </div>
  );
}
