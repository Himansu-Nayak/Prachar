# PRACHAR — PREMIUM UI/UX TRANSFORMATION ROADMAP
**Document Version:** 2.0 (Master Execution Strategy)  
**Status:** In Active Execution  
**Protected Systems Baseline:** 90 JUnit Backend Tests, Next.js 14 App Router (16/16 Routes)  

---

## 1. Master Strategy Overview

This roadmap governs the end-to-end transformation of PRACHAR into a world-class, cinematic, production-ready digital experience combining:
- **BrandAppart-Level:** Branding discipline, typography, layout, color system, editorial composition, motion system, and design-system consistency.
- **21hrs.space-Level:** Cinematic atmosphere, immersive 3D, depth, lighting, spatial composition, slow controlled motion, and visual storytelling.
- **PRACHAR Core:** Odisha cartography, Bhubaneswar capital beacon, phygital publicity doctrine, and the 50,000 door-to-door print distribution network.

---

## 2. Phase Breakdown & Execution Sequence

### Phase 0: Forensic Audit & Planning (Complete)
- [x] Full audit of frontend architecture (Next.js 14, React 18, Tailwind, Three.js, GSAP, Lenis).
- [x] Full audit of backend architecture (Spring Boot 3.3.4, Java 21, Flyway, PostgreSQL, H2).
- [x] Verification of protected systems (Payment state machine, Razorpay flow, webhook deduplication, DPDP hashing).
- [x] Production of foundational governance documentation (`VISUAL_DIRECTION.md`, `DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`, `PREMIUM_UI_ROADMAP.md`).

### Phase 1 & 2: Brand Evolution & Global Design System
- [ ] Centralize brand palette into `:root` CSS and Tailwind theme:
  - Base: Deep charcoal (`#070A12`), Warm Ivory (`#FBF8F3`, `#F4EFEB`), Soft White (`#FFF3EA`).
  - Accents: Prachar Yellow/Saffron (`#FF8800`), Prachar Red (`#E53935`), Odisha Coastal Blue (`#0EA5E9`).
  - Metallics: Warm Copper (`#E4B592`), Celestial Gold (`#D4AF37`).
- [ ] Implement light/dark surface utility classes for seamless section contrast.
- [ ] Define standardized component state tokens (hover, active, focus, disabled, loading).

### Phase 3: Typographic Hierarchy
- [ ] Standardize editorial headline styling, clean interface body text (`Inter`), and technical metadata monospace (`ui-monospace`, `JetBrains Mono`).
- [ ] Implement line-masked editorial reveal typography.
- [ ] Ensure full support for Odia cultural titles (`ଆମ ଅଂଚଳ ର ପ୍ରଚାର`).

### Phase 4–11: Cinematic Hero & 3D Odisha Moon
- [ ] Full-screen cinematic hero integrating the Three.js 3D astronomical Odisha Moon sphere.
- [ ] Verified Survey of India vector boundary for all 30 districts, Chilika Lake, and Bay of Bengal coastline projected without distortion.
- [ ] Precise Bhubaneswar epicenter beacon at `20.2961° N, 85.8245° E` with surface ring, vertical celestial beam, and localized point lighting.
- [ ] Directional lighting: Key sunlight (upper-left), rim light (lower-right), ambient deep space fill.
- [ ] Atmospheric Fresnel glow shell and cosmic dust field.
- [ ] Hero editorial typography: "PUBLICITY FOR ODISHA" / "PRACHAR" display, technical reticle framing, telemetry indicators.
- [ ] Seamless loop: very slow rotation, continuous particles, zero jump or lighting flicker.

### Phase 12–16: Motion Choreography & Phygital Interactive System
- [ ] Scroll storytelling connecting Hero -> Problem -> Concept -> Odisha Network -> Phygital Journey.
- [ ] 4-stage interactive Phygital transformation animation (Physical Ad -> Reticle Scan -> Cloud Router -> Verified Profile).
- [ ] Regional Odisha Network interactive 7-hub selector (Bhubaneswar, Cuttack, Puri, Rourkela, Sambalpur, Berhampur, Balasore) with camera flight.

### Phase 17: Advertising Experience (P1–P5)
- [ ] Spatial interactive rate card for P1 (Full Page Premium Cover), P2 (Full Page Standard), P3 (Half Page Display), P4 (Quarter Page Grid), P5 (Business Card Slot).
- [ ] Live price calculator for single edition vs. 3-edition discounts.
- [ ] Official monthly 18th cutoff timer.
- [ ] Dynamic connection to real product data and fallback constants.

### Phase 18–19: Light/Dark Rhythm & Standardized Component System
- [ ] Orchestrate section rhythm: Dark Hero -> Warm Ivory Problem -> Dark Concept -> Dark Network -> Warm Ivory Phygital -> Dark Advertising -> Warm Ivory Press Sync -> Dark Smart Card -> Dark Trust -> Warm Ivory Final CTA -> Dark Footer.
- [ ] Verify standard states across buttons, inputs, badges, modals, drawers, and tabs.

### Phase 20–21: Dashboard & Navigation Refinement
- [ ] Ensure navigation bar is minimal, transparent, and becomes compact with reading progress indicator on scroll.
- [ ] Ensure mobile drawer provides smooth accessibility.
- [ ] Preserve dashboard's high-speed, data-dense, functional identity while inheriting unified brand tokens.

### Phase 22–26: Micro-Interactions, HD Visuals, Responsiveness, Accessibility & Performance
- [ ] 3D card tilt with specular reflection (`useCardTilt`).
- [ ] Magnetic button feedback (`useMagnetic`).
- [ ] Viewport responsiveness across 320px, 390px, 768px, 1024px, 1280px, 1440px, 1920px.
- [ ] Complete `prefers-reduced-motion` compliance.
- [ ] WebGL memory management: dispose geometries, textures, materials, and cancel animation loops on unmount.

### Phase 27–30: Quality Assurance, Regression Testing & Final Audit
- [ ] Anti-AI visual audit: Eliminate template feel, excessive cards, and random gradients.
- [ ] Browser QA via Chrome DevTools MCP & full-page screenshots.
- [ ] Backend regression suite: 90 / 90 tests passing via `mvn test`.
- [ ] Frontend production build: 16 / 16 routes passing via `npm run build`.
- [ ] Completion report and sign-off.
