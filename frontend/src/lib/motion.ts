"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger once on the client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standard Studio Motion Curve Constants
 */
export const MOTION_EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  circ: "circ.out",
  spring: "elastic.out(1, 0.75)",
  gentle: "power1.out",
} as const;

export const MOTION_DUR = {
  micro: 0.25,
  fast: 0.4,
  normal: 0.75,
  cinematic: 1.2,
  epic: 1.8,
} as const;

/**
 * Check if the user has requested reduced motion
 */
export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Initialize Lenis Smooth Scrolling paired with GSAP ScrollTrigger
 */
export function initSmoothScroll(): (() => void) | undefined {
  if (typeof window === "undefined" || isReducedMotion()) return undefined;

  // Don't initialize on small mobile devices to preserve native touch momentum
  if (window.innerWidth < 768) return undefined;

  try {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  } catch (err) {
    console.warn("Smooth scroll initialization skipped:", err);
    return undefined;
  }
}

/**
 * Hook to apply 3D tilt with specular sheen to an element on pointer movement
 */
export function useCardTilt(maxRotation = 8, scaleOnHover = 1.015) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || isReducedMotion()) return;

    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        gsap.to(el, {
          rotateY: x * maxRotation,
          rotateX: -y * maxRotation,
          scale: scaleOnHover,
          duration: 0.35,
          ease: MOTION_EASE.out,
          transformPerspective: 900,
          transformOrigin: "center center",
        });
      });
    };

    const onPointerLeave = () => {
      cancelAnimationFrame(rafId);
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.55,
        ease: MOTION_EASE.out,
      });
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(el);
    };
  }, [maxRotation, scaleOnHover]);

  return elementRef;
}

/**
 * Hook to apply magnetic pull on interactive buttons
 */
export function useMagnetic(pullFactor = 0.25) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * pullFactor;
      const y = (e.clientY - (rect.top + rect.height / 2)) * pullFactor;

      gsap.to(el, {
        x,
        y,
        duration: 0.3,
        ease: MOTION_EASE.out,
      });
    };

    const onPointerLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(el);
    };
  }, [pullFactor]);

  return ref;
}

export { gsap, ScrollTrigger };
