# PRACHAR — MOTION SYSTEM & CHOREOGRAPHY SPECIFICATION
**Document Version:** 2.0 (Cinematic & Scroll Motion Architecture)  
**Status:** Approved & Binding  
**Scope:** GSAP, ScrollTrigger, Lenis, WebGL 3D Loop, Micro-interactions, Accessibility  

---

## 1. Core Motion Philosophy

Motion in PRACHAR is not decorative eye-candy. It is an editorial and narrative instrument that:
1. **Communicates Physicality:** Replicating the tangible substance of matte paper, ink, and NFC hardware.
2. **Establishes Spatial Scale:** Seamlessly bridging astronomical planetary scale (Odisha satellite moon) down to municipal street-level scale (Bhubaneswar corridors).
3. **Clarifies Phygital Conversion:** Demonstrating how physical print translates into digital interaction in under 3 seconds.

---

## 2. Motion Engine & Timing Standards

### 2.1 Easing Curves

```typescript
export const MOTION_EASE = {
  // Editorial and luxury reveals (fast start, long deceleration)
  out: "power3.out",
  expo: "expo.out",
  // Smooth mechanical transitions
  inOut: "power2.inOut",
  // Gentle tactile interactions
  gentle: "power1.out",
  // Tactile button bounce / magnetic snap
  tactile: "elastic.out(1, 0.75)",
} as const;
```

### 2.2 Durations

- **Micro (Interaction):** `0.20s` – `0.30s` (hover, active, icon shift)
- **UI Transition:** `0.35s` – `0.50s` (dialog, drawer, tab switch)
- **Scroll Reveal:** `0.70s` – `0.95s` (section line-mask, card stagger)
- **Cinematic Stage:** `1.20s` – `2.40s` (camera transition, 3D sphere focal flight)

---

## 3. Four Motion Categories

### 3.1 Micro-Interactions
- **Magnetic Pull on Primary Buttons:** Buttons subtly track pointer within a 30px bounding threshold (`useMagnetic(0.2)`), providing tactile satisfaction without floating away.
- **Card Specular Tilt (`useCardTilt`):** Cards apply subtle 3D rotational tilt (up to `5deg`) paired with dynamic specular highlight, giving surfaces physical weight.
- **Status Indicator Pulses:** Bhubaneswar beacon and active telemetry nodes employ soft sine-wave opacity pulses (`1.8s` loop).

### 3.2 UI Transitions
- **Mobile Navigation Drawer:** Backdrop blur fades from `0` to `20px` while menu links stagger down with an editorial mask reveal.
- **Rate Card Selector (P1–P5):** Clicking an ad tier expands the card container with GPU-accelerated layout transitions, updating format previews instantly.
- **Modal Dialogs:** Backdrop blur with scale from `0.96` to `1.0` and opacity fade in `0.3s`.

### 3.3 Scroll Choreography
- **Lenis Smooth Scrolling:** Configured at duration `1.15s` with smooth wheel interpolation on desktop. Disabled on mobile viewports (< `768px`) to respect natural touch inertia.
- **Editorial Mask Line-Reveals:** Headlines split into lines (`overflow-hidden`) where text transforms from `yPercent: 110` to `0` with `stagger: 0.12s`.
- **Corridor Grid Stagger:** Distribution corridor tiles cascade into view as the user scrolls into the hyper-local grid section.

### 3.4 Cinematic 3D Loop & Storytelling
- **Seamless Odisha Moon Rotation:** Continuous rotation around Y-axis at a stately angular velocity ($\omega = 0.0012 \text{ rad/frame}$).
- **Loop Boundary Guarantee:** The texture wraps seamlessly around the $360^\circ$ sphere geometry, guaranteeing zero frame jumps, zero flickering, and zero lighting discontinuity.
- **Focal Node Flight:** When a regional city (e.g., Cuttack, Puri, Rourkela) is selected, the sphere smoothly interpolates its rotation angles ($\Delta \theta, \Delta \phi$) to center that city under the primary directional key light.
- **Vertical Celestial Ray:** Radiant light beam emerges perpendicularly from Bhubaneswar's coordinates along the surface normal vector.

---

## 4. The Signature Phygital Transformation Sequence

The transformation from physical print to digital action is choreographed across 4 stages:

```
[STAGE 1: PHYSICAL PRINT]
  Delivered door-to-door booklet creative with high-density vector QR
            │
            ▼ (Camera approaches / zoom in)
[STAGE 2: OPTICAL SCAN]
  Camera reticle locks onto QR; optical laser sweeps vertically across code
            │
            ▼ (Cryptographic token resolved via /qr/:uuid)
[STAGE 3: DYNAMIC CLOUD ROUTER]
  Cloud edge routing without reprinting costs; live telemetry logging
            │
            ▼ (Digital profile emerges & unfolds)
[STAGE 4: VERIFIED CONVERSION]
  Verified /u/:username profile unfolds; 1-tap WhatsApp chat & vCard save active
```

---

## 5. Accessibility & Reduced Motion Protocol

Whenever `prefers-reduced-motion: reduce` is detected:
- Continuous 3D sphere rotation stops; the sphere remains stationary with front hemisphere perfectly centered on Odisha.
- Cosmic dust particle drift stops.
- Pulsing glows convert into static solid colors with high visual contrast.
- All page transitions and scroll triggers resolve immediately (`duration: 0.001s`).
- The static state retains 100% of visual dignity and graphic information.
