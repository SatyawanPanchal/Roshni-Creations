import { useEffect, useRef, useState } from "react";

/**
 * Reveals a single element once it enters the viewport.
 * Respects prefers-reduced-motion by revealing immediately, no animation.
 *
 * Usage:
 *   const { ref, isVisible } = useScrollReveal();
 *   <div ref={ref} className={reveal(isVisible)}>...</div>
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = "0px 0px -60px 0px" } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}

/**
 * Same as useScrollReveal, but for a list of items rendered with a
 * staggered delay (e.g. product grids, gallery images).
 *
 * Usage:
 *   const { containerRef, isVisible } = useStaggerReveal();
 *   items.map((item, i) => (
 *     <div style={{ transitionDelay: isVisible ? `${i * 80}ms` : "0ms" }} />
 *   ));
 */
export function useStaggerReveal(options) {
  const { ref: containerRef, isVisible } = useScrollReveal(options);
  return { containerRef, isVisible };
}

// Shared class fragments so every section reveals with the exact same
// easing/duration — keep this the single source of truth for that timing.
export const REVEAL_BASE =
  "tw:transition-all tw:duration-[900ms] tw:ease-[cubic-bezier(0.16,1,0.3,1)] tw:motion-reduce:transition-none";

// NOTE: Tailwind's JIT scanner needs literal class strings in source, so
// this only supports the two preset offsets below rather than an arbitrary
// numeric prop — add more literal branches here if you need another offset.
export function revealClasses(isVisible, { y = 30 } = {}) {
  const hiddenOffset = y === 15 ? "tw:translate-y-[15px]" : "tw:translate-y-[30px]";
  return [
    REVEAL_BASE,
    isVisible ? "tw:opacity-100 tw:translate-y-0" : `tw:opacity-0 ${hiddenOffset}`,
  ].join(" ");
}
