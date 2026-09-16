import { useEffect } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart, type CartItem } from '../context/cartContext';

function formatPrice(value: number) {
  return `KES ${value.toLocaleString()}`;
}

export function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity, totalPrice } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <div
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[210] transition-opacity duration-[600ms] ease-in-out"
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        background: 'rgba(6,6,8,.92)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="fixed inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-[rgba(255,255,255,.1)] shadow-2xl transition-transform duration-[600ms] ease-in-out"
        style={{
          background: 'radial-gradient(140% 100% at 100% 0%, #17171B 0%, #0C0C0E 60%)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.7)',
        }}
      >
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,.08)] px-6 py-5">
          <h2 className="m-0 font-manrope text-[20px] font-bold tracking-[-.02em]">Your Cart</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,.14)] text-[15px] text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <X size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="m-0 text-[15px] leading-[1.6] text-[rgba(243,240,234,.5)]">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-[rgba(255,255,255,.08)] px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-inter text-[13px] font-medium tracking-[.08em] text-grey-1">TOTAL</span>
            <span className="font-inter text-[18px] font-semibold text-accent">{formatPrice(totalPrice)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            className="w-full rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white disabled:pointer-events-none disabled:opacity-60"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function CartRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <div className="text-[15px] font-medium text-ivory">{item.name}</div>
          {item.subOption && (
            <div className="mt-0.5 text-[13px] text-[rgba(243,240,234,.5)]">{item.subOption}</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,.14)] p-1">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-6 w-6 items-center justify-center rounded-full text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:text-accent"
            >
              <Minus size={13} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <span className="w-6 text-center text-[13.5px] text-ivory">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-6 w-6 items-center justify-center rounded-full text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:text-accent"
            >
              <Plus size={13} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove item"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[rgba(243,240,234,.4)] transition-colors duration-300 hover:text-[#ff8a8a]"
          >
            <Trash2 size={15} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 pt-0.5">
        <span className="text-[15px] font-medium text-ivory">{formatPrice(item.price * item.quantity)}</span>
        <span className="text-[12px] text-[rgba(243,240,234,.4)]">{formatPrice(item.price)} each</span>
      </div>
    </div>
  );
}
