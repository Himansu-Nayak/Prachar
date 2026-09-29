# PRACHAR ODISHA HERO MAP ARCHITECTURE (PHASE 2)
## Project: PRACHAR (Phygital Publicity Platform)
**Document:** `docs/HERO_ARCHITECTURE.md`  
**Status:** PHASE 2 IMPLEMENTATION BASELINE  
**Date:** September 2026

---

## 1. Visual Intent & Regional Anchoring

The homepage hero visual establishes the fundamental brand identity of PRACHAR:
**"Odisha Regional Publicity rooted in Bhubaneswar with digital phygital expansion across the state."**

```
+------------------------------------------------------------------------------------+
|                               ODISHA HERO COMPOSITION                              |
+------------------------------------------------------------------------------------+
                                      [Sundargarh / Rourkela]
                                                 ▲
                                                 │ (Digital Corridor)
                                                 │
   [Western Hub: Sambalpur] ◄─────── [BHUBANESWAR] ───────► [Coastal Hub: Balasore]
                                    (20.2961° N, 85.8245° E)
                                      (Radar Pulse Beacon)
                                                 │
                                                 ▼
                                     [Southern Hub: Berhampur]
                                                 │
                                                 ▼
                                        [Bay of Bengal Arc]
```

---

## 2. Technical Specifications

- **Container Aspect Ratio:** Fixed `aspect-[4/3]` with zero Cumulative Layout Shift (CLS).
- **Asset Size:** Lightweight vector SVG `<25 KB`, embedded natively as React JSX without external large raster/GeoJSON downloads.
- **Geographic Center:** Bhubaneswar located at `20.2961° N, 85.8245° E`, projected to SVG coordinates `(485, 350)`.
- **Regional Hubs Modeled:** Bhubaneswar (Active Print Edition 1), Cuttack (Twin City), Puri (Pilgrimage Hub), Rourkela, Sambalpur, Berhampur, Balasore.

---

## 3. 7-Stage Animation Pipeline

1. **Stage 1 — Contour Drawing:** Animated border reveal with SVG stroke paths.
2. **Stage 2 — Regional Fill:** Ambient gradient fill establishing Odisha's physical presence.
3. **Stage 3 — Bhubaneswar Anchor:** Coordinate marker ping and beacon center appear.
4. **Stage 4 — Radar Wave Ring:** Concentric rings (`animate-ping` / `animate-pulse`) visualizing local media coverage.
5. **Stage 5 — Connectivity Vectors:** Subtle dashed orange lines connecting Bhubaneswar to regional nodes.
6. **Stage 6 — Typography Stabilization:** Header text, cutoff date badge, and coordinates lock into position.
7. **Stage 7 — Interactive Depth:** Node hover/selection updates the active city info card in real-time.

---

## 4. Accessibility & Reduced Motion Handling

In full compliance with WCAG 2.1 Level AA and Section 508:
- When `@media (prefers-reduced-motion: reduce)` is active, all CSS animations (`animate-ping`, `animate-pulse`, continuous transitions) are disabled.
- The map renders immediately in its fully stabilized, legible state.
- Interactive node focus states are fully operable via keyboard (`Tab` and `Enter/Space`).
