import { useEffect, useState, type ComponentType } from 'react';
import { ArrowRight, Check, Copy, CreditCard, Link2, Mail, MessageCircle, Share2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

const REFERRAL_LINK = 'luxecard.africa/r/yourname';
const SHARE_CHANNELS: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>[] = [
  MessageCircle,
  Mail,
  Share2,
];

function LinkNode() {
  const { ref, style } = useReveal<HTMLDivElement>();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    try {
      navigator.clipboard?.writeText(`https://${REFERRAL_LINK}`).catch(() => {});
    } catch {
      // Clipboard API unavailable or blocked; the UI feedback still shows regardless.
    }
  };

  return (
    <div ref={ref} style={style} className="flex flex-1 flex-col items-center gap-4 text-center">
      <div className="font-inter text-[10px] font-medium tracking-[.14em] text-accent">GET YOUR LINK</div>
      <button
        type="button"
        onClick={handleCopy}
        className="group flex items-center gap-3 rounded-full border px-5 py-3.5 transition-colors duration-300"
        style={{ borderColor: copied ? '#FDD303' : 'rgba(255,255,255,.14)', background: '#101013' }}
      >
        <Link2 size={16} strokeWidth={1.8} className="shrink-0 text-accent" aria-hidden="true" />
        <span className="whitespace-nowrap font-inter text-[13.5px] text-[rgba(243,240,234,.75)]">
          {REFERRAL_LINK}
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[rgba(243,240,234,.5)] transition-colors duration-300 group-hover:text-accent">
          {copied ? (
            <Check size={14} strokeWidth={2.2} className="text-accent" aria-hidden="true" />
          ) : (
            <Copy size={14} strokeWidth={1.8} aria-hidden="true" />
          )}
        </span>
      </button>
      <p
        className="m-0 h-[16px] text-[12.5px] font-medium text-accent"
        style={{ opacity: copied ? 1 : 0, transition: 'opacity .3s ease' }}
      >
        Copied!
      </p>
    </div>
  );
}

function ShareNode() {
  const { ref, style, visible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} style={style} className="flex flex-1 flex-col items-center gap-4 text-center">
      <div className="font-inter text-[10px] font-medium tracking-[.14em] text-accent">SHARE ANYWHERE</div>
      <div className="flex items-center gap-3">
        {SHARE_CHANNELS.map((Icon, i) => (
          <div
            key={i}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,.14)] transition-[opacity,transform] duration-500 ease-lux"
            style={{
              background: '#101013',
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(.6)',
              transitionDelay: `${i * 120}ms`,
            }}
          >
            <Icon size={18} strokeWidth={1.7} className="text-[rgba(243,240,234,.65)]" />
          </div>
        ))}
      </div>
      <p className="m-0 max-w-[180px] text-[12.5px] leading-[1.5] text-[rgba(243,240,234,.45)]">
        WhatsApp, Instagram, email: wherever your network is.
      </p>
    </div>
  );
}

function EarnNode() {
  const { ref, style, visible } = useReveal<HTMLDivElement>();
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => setPurchased(true), 500);
    return () => clearTimeout(timeout);
  }, [visible]);

  return (
    <div ref={ref} style={style} className="flex flex-1 flex-col items-center gap-4 text-center">
      <div className="font-inter text-[10px] font-medium tracking-[.14em] text-accent">YOU EARN</div>
      <div className="relative flex h-12 w-12 items-center justify-center my-3">
        {purchased &&
          [0, 0.7, 1.4].map((delay) => (
            <span
              key={delay}
              className="absolute inset-0 animate-lc-ripple rounded-full border"
              style={{ borderColor: 'rgba(253,211,3,.4)', animationDelay: `${delay}s` }}
            />
          ))}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-500"
          style={{
            borderColor: purchased ? 'rgba(253,211,3,.5)' : 'rgba(255,255,255,.14)',
            background: '#0C0C0F',
          }}
        >
          <CreditCard size={18} strokeWidth={1.7} className="text-accent" aria-hidden="true" />
        </div>
      </div>
      <div
        className="flex items-center gap-1.5 rounded-full border border-[rgba(253,211,3,.35)] bg-[#101013] px-3.5 py-2 transition-[opacity,transform] duration-500 ease-lux"
        style={{
          opacity: purchased ? 1 : 0,
          transform: purchased ? 'translateY(0)' : 'translateY(8px)',
          transitionDelay: '250ms',
        }}
      >
        <Check size={13} strokeWidth={2.4} className="text-accent" aria-hidden="true" />
        <span className="whitespace-nowrap text-[12.5px] font-medium text-ivory">Sale confirmed: +10%</span>
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex shrink-0 items-center justify-center py-1 min-[900px]:py-0">
      <ArrowRight
        size={20}
        strokeWidth={1.6}
        className="animate-pulse rotate-90 text-grey-2 min-[900px]:rotate-0"
        aria-hidden="true"
      />
    </div>
  );
}

export function AffiliateLinkJourney() {
  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(48px,7vh,80px)] text-center">
          <div className="mb-4 font-inter text-[10px] font-medium tracking-[.2em] text-accent">
            HOW SHARING WORKS
          </div>
          <h2 className="m-0 font-manrope text-[clamp(30px,4.2vw,52px)] font-bold leading-[1.05] tracking-[-.032em]">
            Your Link. Their Purchase.
            <br />
            Your Commission.
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8 min-[900px]:flex-row min-[900px]:items-start">
          <LinkNode />
          <FlowConnector />
          <ShareNode />
          <FlowConnector />
          <EarnNode />
        </div>
      </div>
    </RevealSection>
  );
}
