/**
 * Animation Foundation Utility
 * 
 * Provides safe client-only animation execution, reduced-motion detection,
 * and lazy-loading boundaries for GSAP/Lenis integrations in subsequent phases.
 */

export function isPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type AnimationCallback = () => void | (() => void);

/**
 * Executes an animation safely on the client only if the user has not requested reduced motion.
 * Prevents hydration mismatch and non-blocking page load.
 */
export function runClientAnimation(callback: AnimationCallback): (() => void) | undefined {
  if (typeof window === "undefined") return undefined;
  if (isPrefersReducedMotion()) {
    return undefined;
  }

  // Defer animation execution to ensure initial LCP paint is unobstructed
  const timeoutId = setTimeout(() => {
    callback();
  }, 100);

  return () => clearTimeout(timeoutId);
}
