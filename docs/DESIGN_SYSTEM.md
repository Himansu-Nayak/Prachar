# PRACHAR — MASTER DESIGN SYSTEM SPECIFICATION
**Document Version:** 2.0 (Design Token Architecture)  
**Status:** Approved & Binding  
**Scope:** Global Design Tokens, Typography Scales, Component States, Surface Architecture  

---

## 1. Design Token Hierarchy

### 1.1 Color Tokens

```css
:root {
  /* Surface Foundations */
  --prachar-bg-void: #000000;
  --prachar-bg-canvas: #070A12;
  --prachar-bg-obsidian: #050811;
  --prachar-bg-surface: #0E1424;
  --prachar-bg-surface-elevated: #141C33;
  --prachar-bg-ivory: #FBF8F3;
  --prachar-bg-ivory-warm: #F4EFEB;

  /* Text & Foreground */
  --prachar-text-primary-dark: #FFF3EA;
  --prachar-text-secondary-dark: #DAD0C8;
  --prachar-text-muted-dark: #94A3B8;
  --prachar-text-primary-light: #0F172A;
  --prachar-text-secondary-light: #334155;
  --prachar-text-muted-light: #64748B;

  /* Brand Accents */
  --prachar-yellow: #FF8800;
  --prachar-yellow-glow: rgba(255, 136, 0, 0.35);
  --prachar-red: #E53935;
  --prachar-red-glow: rgba(229, 57, 53, 0.35);
  --prachar-blue: #0EA5E9;
  --prachar-blue-glow: rgba(14, 165, 233, 0.35);

  /* Supporting & Hardware Tones */
  --prachar-copper: #E4B592;
  --prachar-copper-light: #F0D1BC;
  --prachar-gold: #D4AF37;
  --prachar-border-subtle: rgba(255, 255, 255, 0.08);
  --prachar-border-copper: rgba(228, 181, 146, 0.25);
  --prachar-border-light: rgba(15, 23, 42, 0.12);

  /* Semantic Feedback */
  --prachar-success: #10B981;
  --prachar-warning: #F59E0B;
  --prachar-error: #F43F5E;
  --prachar-info: #38BDF8;
}
```

---

## 2. Typographic Architecture

PRACHAR enforces a disciplined three-tier font system:

1. **Display & Editorial:** Tight tracking, monumental scale, high-contrast serif/editorial or sculptured sans for section headlines and hero statements.
2. **Interface & Body:** Clean, high-legibility sans-serif (`Inter`, `system-ui`) optimized for dense information architecture and reading comfort.
3. **Technical & Telemetry:** Precise monospace (`JetBrains Mono`, `ui-monospace`, `Consolas`) with extended tracking for coordinates, system metrics, statuses, and codes.

### Typographic Scale

| Role | Font Family | Size | Weight | Tracking | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Monument** | Editorial / Sans | 4.5rem – 8.0rem | 900 | `-0.04em` | `0.85` | Hero monument, monumental numbers |
| **Headline XL** | Editorial / Sans | 2.5rem – 3.75rem | 800 | `-0.03em` | `1.05` | Major section titles |
| **Headline LG** | Editorial / Sans | 1.875rem – 2.25rem | 700 | `-0.02em` | `1.15` | Subsection headings, modal titles |
| **Title MD** | Interface Sans | 1.25rem – 1.5rem | 600 | `-0.01em` | `1.30` | Card titles, rate card packages |
| **Body Primary** | Interface Sans | 0.9375rem – 1.0rem | 400 | `normal` | `1.60` | Explanatory narrative, descriptions |
| **Body Technical** | Monospace | 0.75rem – 0.8125rem | 500 | `0.05em` | `1.50` | Specifications, delivery notes |
| **Label / Telemetry** | Monospace | 0.625rem – 0.6875rem | 700 | `0.22em` | `1.20` | Section codes (`[SYS.PRINT.01]`), badges |
| **Odia Header** | Odia Serif | 0.875rem – 1.125rem | 600 | `normal` | `1.40` | Cultural subtitles (`ଆମ ଅଂଚଳ ର ପ୍ରଚାର`) |

---

## 3. Spacing & Grid System

- **xs:** `4px` (`0.25rem`)
- **sm:** `8px` (`0.5rem`)
- **md:** `16px` (`1.0rem`)
- **lg:** `24px` (`1.5rem`)
- **xl:** `32px` (`2.0rem`)
- **2xl:** `48px` (`3.0rem`)
- **3xl:** `64px` (`4.0rem`)
- **4xl:** `96px` – `128px` (`6.0rem` – `8.0rem`)

Containers adhere to `max-w-7xl` (`1280px`) with fluid responsive side padding: `px-4` (mobile, `390px`), `px-8` (tablet/laptop), `px-12` (desktop).

---

## 4. Radii & Surface Treatment

- **Sharp / Technical (`0px`):** Used on reticle boxes, technical HUD panels, and architectural dividers to echo precision print stock and camera viewfinders.
- **Micro (`2px` – `4px`):** Status pills, telemetry tags, and form input fields.
- **Subtle (`8px`):** Interactive cards, modal dialogs, and flyout menus.
- **Pill (`9999px`):** High-priority primary CTAs, hub selection filters, and reading progress indicators.

---

## 5. Shadows & Elevation

- **Subtle:** `0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)`
- **Medium Surface:** `0 10px 25px -5px rgba(0,0,0,0.7), 0 0 1px rgba(255,255,255,0.1)`
- **Cinematic Depth:** `0 25px 60px -15px rgba(0,0,0,0.95), 0 0 40px -10px rgba(0,0,0,0.8)`
- **Saffron Beacon Glow:** `0 0 35px 4px rgba(255,136,0,0.4)`
- **Copper Reticle Glow:** `0 0 25px 2px rgba(228,181,146,0.35)`

---

## 6. Comprehensive Component Interactive States

Every interactive component must implement distinct visual definitions for all 6 states:

| Component | Default | Hover | Active (Pressed) | Focus-Visible | Disabled | Loading |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Reticle Button** | Copper border, transl. bg | Full copper fill, black text, glow | Scale `0.98`, high contrast | 2px saffron outline, 2px offset | Opacity `0.45`, cursor not-allowed | Animated spinner, text dim |
| **Secondary Button** | Obsidian bg, white/15 border | White/10 bg, copper border | Scale `0.98` | 2px copper outline | Opacity `0.4`, unclickable | Text hidden, centered spinner |
| **Rate Card (P1–P5)** | 1px border, transl. gradient | 1px copper border, scale `1.01` | Border active saffron, badge | Full border focus ring | Opacity `0.5`, grayed | Skeleton pulse |
| **Form Input** | Dark canvas, white/10 border | White/20 border | White/30 border | 1px copper border + glow | Opacity `0.4`, disabled bg | Loader icon inside right slot |
| **Hub Selector Pill** | Slate outline, mono text | Copper text, subtle fill | Filled saffron/copper, bold | Outline ring | Dimmed | Pulse state |

---

## 7. Dual Aesthetic Doctrine: Marketing vs. Dashboard

- **Marketing Website (`/`, `/product`, `/advertise`, `/about`):**
  - Atmospheric, cinematic, spatial, storytelling-driven, generous whitespace, 3D Odisha Moon.
- **Merchant & Admin Dashboard (`/dashboard`, `/admin`):**
  - Precise, high-speed, data-dense, functional, clean tabular views, zero decorative lag.
  - Shares brand colors, typography tokens, and status pills, but optimizes for productivity.
