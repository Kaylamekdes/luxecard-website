# Handoff: LuxeCard Africa — one-page marketing site

## Overview
A single-page, dark-first marketing site for LuxeCard Africa, a premium NFC/QR digital business-card ecosystem. The page runs one continuous narrative — introduction → connection → action — anchored by an animated `card → tap → phone profile` sequence in the hero and a four-stage interactive product demo in "How It Works".

The design is **approved and is the source of truth**. Implement it as specified; do not reinterpret layout, type, color, hierarchy, or interaction.

## About the design files
`reference/LuxeCard Africa.dc.html` is a **design reference created in HTML** — a working prototype of the intended look and behavior, not production code to lift wholesale. It is a single self-rendering component file (`support.js` is its runtime; it is not part of the deliverable).

Your task is to **recreate this design in a production frontend** — React + TypeScript + Vite + Tailwind (or the project's existing React architecture, if one exists — use it rather than replacing it). Framer Motion only where a CSS transition genuinely cannot express the motion; almost all motion here is CSS transitions/keyframes.

Open the reference file in a browser to see every animation, timing and hover state live. It is the visual QA target.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, shadows, easing and timings below are final and exact. Recreate pixel-faithfully. The only deliberately unfinished elements are photography and product renders, which are marked placeholders (see **Assets**).

---

## Design tokens

### Color
| Token | Value | Use |
|---|---|---|
| `bg` | `#08080A` | page background, hero base, footer |
| `bg-alt` | `#0A0A0C` | alternating section background (How It Works, Value, Professionals) |
| `surface` | `#0C0C0E` | cards, panels |
| `surface-raised` | `#0D0D10` | value-pillar cards |
| `surface-hover` | `#101013` | value-pillar hover |
| `ivory` | `#F3F0EA` | primary text, primary button fill, For Business section background |
| `ivory-62` | `rgba(243,240,234,.62)` | strong secondary text |
| `ivory-55` | `rgba(243,240,234,.55)` | body copy |
| `ivory-50` | `rgba(243,240,234,.50)` | tertiary copy |
| `accent` | `#FDD303` | brand yellow — highlighted headline words, eyebrow labels, active states, ripples |
| `accent-tint` | `rgba(253,211,3,.07)` | active/selected panel fill |
| `accent-border` | `rgba(253,211,3,.24 – .32)` | active/hover borders |
| `grey-1` | `#8C8A85` | labels |
| `grey-2` | `#6F6D68` | micro-labels |
| `grey-3` | `#57554F` | placeholder captions, legal |
| `ink` | `#0B0B0D` | text on ivory (For Business section) |
| `border` | `rgba(255,255,255,.07)` | default card border |
| `border-strong` | `rgba(255,255,255,.11)` | physical-card edge |
| `divider` | `rgba(255,255,255,.06)` | section dividers |

Accent is used **sparingly** — one highlighted word per major headline, eyebrow labels, and active states. Never as a large fill.

Section gradients:
- Hero: `radial-gradient(120% 90% at 78% 10%, #16161A 0%, #0B0B0D 46%, #08080A 100%)`
- Final CTA: `radial-gradient(100% 80% at 50% 100%, #1A1915 0%, #0B0B0D 55%, #08080A 100%)`
- Physical card face: `linear-gradient(132deg, #26262B 0%, #101013 46%, #1A1A1F 100%)` + `inset 0 1px 0 rgba(255,255,255,.09)`
- Phone body: `linear-gradient(160deg, #2A2A30, #101012 55%, #1C1C21)`

### Typography
Google Fonts: `Manrope` 500/600/700/800, `Inter` 400/500/600/700. **No third family.** Instrument Serif is not used and must not be introduced.

| Role | Family / weight | Size | Line-height | Tracking |
|---|---|---|---|---|
| Hero H1 | Manrope 800 | `clamp(46px, 7.6vw, 100px)` | `.96` | `-0.035em` |
| Cinematic H2 (Meet Once, Final CTA) | Manrope 800 | `clamp(38px, 6.4vw, 88px)` / `clamp(40px, 7vw, 96px)` | `.97–.98` | `-0.035em` |
| Section H2 | Manrope 700 | `clamp(34px, 5.6vw, 72px)` | `.96–1` | `-0.032em` |
| Subsection H3 | Manrope 500–600 | `22–46px` (`clamp(24px, 2.6vw, 32px)` for pillars) | 1.1 | `-0.03em` |
| Body | Inter 400 | `16.5px` (hero lead `clamp(16px, 1.35vw, 19px)`) | `1.6` | 0 |
| Small UI / buttons | Inter 500–600 | `13.5–16px` | 1.2 | `.01em` |
| Eyebrow / label | Inter 500–600, uppercase | `9–11px` | 1 | `.13–.18em` |

### Spacing
Section vertical rhythm: `clamp(90px, 13vh, 150px)` (hero `clamp(120px, 15vh, 180px)` top; final CTA `clamp(100px, 16vh, 190px)`).
Horizontal gutter: `clamp(20px, 4vw, 48px)`. Content max-width: `1320px` (FAQ `1000px`).
Grid gaps: `clamp(40px, 5vw, 80px)` between columns, `14–20px` between cards.
Card padding: `clamp(26px, 3vw, 44px)`.

### Radius
`999px` pills/buttons · `20px` ecosystem hero card · `18px` cards & physical card (hero card `16px`) · `14px` list panels · `10–13px` in-phone UI · phone body `42px` / screen `33px` (hero), `50px` / `39px` (How It Works).

### Shadow
- Physical card: `0 44px 80px -34px rgba(0,0,0,.95)`
- Phone: `0 60px 100px -50px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.07)`
- Primary button: `0 18px 44px -22px rgba(243,240,234,.6)`, hover `0 26px 54px -20px rgba(243,240,234,.55)`

### Motion
- Easing: `cubic-bezier(.16, 1, .3, 1)` for everything positional; `ease` for opacity.
- Durations: hover `.35–.6s` · scroll reveal `1s` opacity / `1.1s` transform · phone/card moves `.8–1.1s` · nav state `.5s`.
- Scroll reveal: `opacity 0 → 1`, `translateY(28px) → 0`, triggered when the element's top passes 88% of viewport height.
- Keyframes: `lcRipple` (scale .4→2.4, opacity 0→.55→0, 1.1s ease-out) and `lcFloat` (±10px, 7s ease-in-out infinite, ecosystem hero card only).
- **`prefers-reduced-motion: reduce`** → skip all reveals and loops, render every section and both phone states in their final state.

---

## Sections, in order

### 1. Navigation — fixed, 68px
Left: wordmark `LuxeCard` (Manrope 600, 18px) + superscript `AFRICA` (Inter 600, 9px, `.16em`, `#8C8A85`, `translateY(-6px)`).
Right (≥900px): `Products · How It Works · For Business · FAQs` (Inter, 14px, `rgba(243,240,234,.68)`) then the primary pill `Get Your LuxeCard` (ivory fill, ink text, 11px/20px padding, lifts `-2px` on hover).
Transparent at top; at `scrollY > 24` → `background rgba(8,8,10,.82)`, `backdrop-filter blur(18px) saturate(140%)`, `border-bottom rgba(255,255,255,.08)`, transitioned over `.5s`.
< 900px: nav links collapse to a `MENU` / `CLOSE` outline pill; open state is a full-width panel below the bar (`rgba(8,8,10,.97)`), links at Manrope 22px, primary CTA full-width at the bottom. Selecting any item closes the menu.

### 2. Hero
Two-column grid, `minmax(min(100%,400px), 1fr)` auto-fit, centered.
Left: eyebrow `● ONE TAP. EVERYTHING YOU.` (accent dot) · H1 `YOUR INTRODUCTION,` / `UPGRADED.` with **UPGRADED.** in `#FDD303` · lead copy (max-width 460px) · CTA row: primary pill `Get Your LuxeCard` + text link `See How It Works →` (underlined by a 1px bottom border that turns accent on hover) · trust row: `NFC + QR · NO APP TO VIEW · UPDATE ANYTIME`.
Right: the tap animation (below).

### 3. Hero tap animation — highest priority
Stage: `min-height: clamp(420px, 56vh, 560px)`, radial accent glow behind, phone centered (`clamp(238px,25vw,288px)` wide, aspect `9/19.2`), physical card absolutely positioned `left:0; top:10%`, width `clamp(230px,24vw,300px)`, aspect `1.6`.

Loop (`step` state, ms): `0:900 → 1:1000 → 2:620 → 3:1200 → 4:2600 → 5:900`, repeating.

| step | card transform | phone |
|---|---|---|
| 0 | `translate(-6%,150%) scale(.95)` — resting below phone mid-point | lock screen (`9:41` + `HOLD NEAR CARD`) |
| 1 | `translate(30%,-2%) scale(1.02)` — rises to the **top** of the phone | lock screen |
| 2 | same | ripple ring fires at `left:34% top:16%` (`lcRipple`) |
| 3 | `translate(-6%,150%) scale(.95)` — slides back down, clear of the screen | profile fades/rises in (`opacity 0→1`, `translateY(14px)→0`) |
| 4 | resting | `Contact saved` toast rises in |
| 5 | resting | toast out, loop restarts |

Card stays **upright at all steps** (no rotation). Card face: wordmark, `● NFC` label, contact name, `TAP. SCAN. CONNECT.`
A `REPLAY TAP` outline pill sits bottom-right of the stage; below 900px the stage gets `72px` bottom padding and the button drops to `bottom:-14px` so it never overlaps the device.

Phone profile content (hero, condensed): cover strip · 54px avatar overlapping `-34px` · name + title · `Save Contact` (ivory fill) and `WhatsApp` (outline) · four social tiles `IG / IN / X / WEB` · two link rows (`Portfolio`, `Book a meeting`) with `→` affordances.

### 4. How It Works (`#how`, scroll target of the secondary CTA)
H2 `ONE TAP. / EVERYTHING YOU.` with a right-aligned note "Four stages, two seconds. Step through it below."
Left column: four selectable stage rows (`01 TAP · 02 OPEN · 03 CONNECT · 04 FOLLOW UP`) — each `44px 1fr` grid, 22px/20px padding, 14px radius. Active row: `rgba(253,211,3,.07)` fill, accent border, accent number, ivory title. Inactive: transparent, `rgba(255,255,255,.07)` border, `rgba(243,240,234,.55)` title.
Right: a larger phone (`clamp(280px,32vw,360px)`).
Auto-advance every **2600ms** once the section is ≥40% visible, stopping at stage 4; **clicking any stage locks manual control** and cancels the timer.
Phone states: stage 0 = tap prompt (78px accent ring reading `TAP`); stages 1–2 = full profile, with the action buttons/socials/links at `opacity .15 → 1` and `translateY(10px) → 0` when stage ≥ 2 (staggered `.1s`, `.18s`); stage 3 = follow-up screen (saved contact row, accent-bordered message card, two action rows).

### 5. Problem
H2 `NETWORKING SHOULD NOT / END WITH A HANDSHAKE.` Two panels side by side.
Left "THE OLD WAY": five lines at Manrope `clamp(20px,2.4vw,30px)` in `rgba(243,240,234,.3)`, last line struck through.
Right "LUXECARD": accent eyebrow, accent-tinted border and `linear-gradient(160deg,#13120F,#0C0C0E 70%)` background, five lines in full ivory, final line in accent.

### 6. Value
H2 `MORE THAN A / BUSINESS CARD.` + note "Your professional identity, designed to move with you."
Three cards (`01/02/03` accent numbers, Manrope 500 titles, 16.5px body). Hover: `translateY(-6px)`, border → `rgba(253,211,3,.3)`, background → `#101013`.

### 7. Product ecosystem (`#products`)
H2 `ONE ECOSYSTEM. / ENDLESS WAYS TO CONNECT.`
Editorial split, **not** five equal cards: a hero panel spanning two rows (`min-height: clamp(400px,52vh,560px)`, radial background, floating card render, `THE ORIGINAL` eyebrow, `LuxeCard` at `clamp(30px,3.6vw,46px)`, `NFC + QR` tag, description, `Get Your LuxeCard →` link that goes from `.6` to full opacity on hover) beside a 2×2 grid of four supporting products: **Tap Pen, Tap Keyholder, WiFi Pass, Review Tap**.
Supporting card hover: `translateY(-6px)`, accent border, description opacity `.4 → 1`.

### 8. For professionals
H2 `MAKE EVERY / INTRODUCTION COUNT.` with six outline context chips (`CONFERENCES, CLIENT MEETINGS, SALES, CREATIVE, FOUNDERS, CONSULTANTS`).
Three `3/4` photo slots; the middle one offset `translateY(clamp(0px,3vw,40px))` for editorial rhythm.

### 9. Networking moment
Full-bleed band, `min-height: clamp(460px,72vh,720px)`, image with `linear-gradient(to top, rgba(8,8,10,.96) 8%, rgba(8,8,10,.5) 55%, rgba(8,8,10,.75) 100%)` scrim, copy bottom-left: `MEET ONCE. / STAY CONNECTED.` + supporting line.

### 10. After the tap
H2 `THE INTRODUCTION / DOESN'T HAVE TO END THERE.` Five numbered steps — Tap · Profile opened · Connection · Follow-up · **Opportunity** (accent-tinted card). Footnote: insights only where the plan supports them — **no invented metrics**.

### 11. For business (`#business`) — inverted
Ivory `#F3F0EA` background, `#0B0B0D` text. H2 `ONE NETWORK. / YOUR ENTIRE TEAM.` Primary dark pill `Equip Your Team →`, text link `Talk to LuxeCard`.
Right: a 2×2 benefit table built from `1px` gaps over `rgba(11,11,13,.12)` — consistent branding, team profiles, bulk deployment, event-ready.

### 12. FAQ (`#faqs`)
H2 `QUESTIONS, / ANSWERED.` Eight rows, 1px dividers, Manrope `clamp(17px,1.9vw,23px)` questions, `+` glyph rotating `45°` when open. Single-open accordion, first item open by default; `max-height 0 → 320px` over `.55s` plus opacity `.45s`. `aria-expanded` on each trigger.

### 13. Final CTA (`#get`)
Centered. H2 `MAKE YOUR NEXT / INTRODUCTION / UNFORGETTABLE.` (last line accent) · "Your name. Your story. Your world. One tap away." · primary pill (label is prop-driven) + `For Business →` link.
Below, a large card render: clicking the primary button triggers a 1600ms tap flourish — card `translateY(-10px) scale(1.03)`, accent ring `opacity 0 → 1`, caption switches `TAP. SCAN. CONNECT.` → `TAPPED — PROFILE OPENED`.

### 14. Footer
Wordmark + `ONE TAP. EVERYTHING YOU.` in accent · two link columns · bottom bar `© 2026 LUXECARD AFRICA` / `PRIVACY` `TERMS`.

---

## Interactions & behavior
| Interaction | Spec |
|---|---|
| Sticky nav | scroll state at `>24px`, `.5s` transitions |
| Mobile menu | opens under the bar, closes on any selection |
| `See How It Works →` | smooth-scroll to `#how` (`scroll-behavior: smooth`, `scroll-margin-top: 68px` on targets) — never a reload or modal |
| Hero tap loop | timed sequence above; `REPLAY TAP` restarts it |
| How It Works | auto-advance on view; click locks manual selection |
| Product hover | lift + accent border + description reveal |
| Buttons | primary lifts `-3px` and deepens its shadow; secondary arrow/underline shifts to accent |
| FAQ | single-open accordion, keyboard-operable |
| Scroll reveal | 28px rise + fade per section |
| Final CTA | 1600ms tap flourish |

**Reveal implementation note:** the reference drives reveals with a scroll listener plus a 300ms interval that re-checks any element still hidden, and unbinds once all are shown. In React, prefer per-section state (`useInView` / `IntersectionObserver` inside each section component) so a parent re-render can never strand a section at `opacity: 0` — that bug occurred with a shared imperative observer and must not be reproduced.

## State
- `scrolled: boolean` — nav surface
- `menuOpen: boolean` — mobile nav
- `heroStep: 0–5` — hero tap loop (interval; pause/reset on `REPLAY TAP`)
- `stage: 0–3` + `stageLocked: boolean` — How It Works
- `hoveredProduct: number | 'hero' | null`
- `openFaq: number` (`-1` = all closed; `0` initially)
- `finalTap: boolean` — 1600ms flourish
- `viewportWidth` — the ≥900px nav breakpoint (use a CSS media query / `matchMedia` rather than re-rendering on every resize)

No data fetching. Content is static — put copy in `src/data/` modules.

## CTA destinations
Define as named constants in one place (e.g. `src/data/links.ts`); do **not** invent URLs:
```ts
export const LINKS = {
  ORDER: '#get',        // TODO: LuxeCard order/checkout URL
  BUSINESS: '#business',// TODO: team/enterprise enquiry flow
  CONTACT: '#get',      // TODO: contact channel (WhatsApp / email / form)
  SOCIAL: { instagram: '', linkedin: '' }, // TODO
  LEGAL: { privacy: '', terms: '' },       // TODO
};
```

## Assets — all currently placeholders
No real imagery exists yet. Each placeholder is a striped panel with a monospace-style caption describing the required shot; keep the exact composition and aspect ratio when real assets land.
1. Profile photo — square, in-phone avatar (hero and How It Works).
2. Professionals — three `3:4` portraits: executive on a Lagos rooftop in evening light; two professionals mid card-tap, hands in frame; creative director in a studio, candid, shallow depth of field. Modern, confident African professionals in sophisticated settings; no generic corporate stock, no stereotypical imagery.
3. Networking moment — one full-bleed cinematic still, handshake resolving into a tap at an evening event; must read under the dark scrim with copy bottom-left.
4. Product renders — LuxeCard (hero, currently a CSS render that may stay if the real render isn't ready), Tap Pen, Tap Keyholder, WiFi Pass, Review Tap. Editorial lighting, minimal background, premium surfaces.

**No testimonials, client logos, statistics or analytics numbers appear anywhere** — that is deliberate, per the no-fabrication rule. If a social-proof section is added later it must use verified content only.

## Accessibility
Semantic `<nav> <section> <footer>`, one `<h1>`, sequential `<h2>/<h3>`. Visible focus rings (accent works well on dark). Accordion triggers are `<button aria-expanded>`. Stage selectors are buttons with clear labels. Alt text on every real image; decorative placeholders `aria-hidden`. Full reduced-motion path. Ivory-on-dark and ink-on-ivory both exceed AA; the yellow accent is used for emphasis and large text, not small body copy on dark.

## SEO
Title `LuxeCard — Your introduction, upgraded.` · meta description from the hero lead · Open Graph + Twitter card with a hero render · canonical placeholder · favicon from the wordmark mark · `Organization` / `Product` structured data once real details exist.

## Performance
Self-host or `preconnect` the two Google families and subset to the weights listed. Lazy-load below-the-fold imagery with explicit dimensions. Prefer CSS transitions/keyframes over an animation library. Use `transform`/`opacity` only for the tap sequence. Clear all intervals on unmount.

## Files
- `reference/LuxeCard Africa.dc.html` — the approved design (open in a browser; source of truth)
- `reference/support.js` — prototype runtime only; **not** part of the implementation
