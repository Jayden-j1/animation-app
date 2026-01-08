// src/components/Parallax/ParallaxPanel.tsx
//
// PURPOSE
// -------
// Reusable internal scroll panel engine:
// - Provides scrollRef + MotionValue<number> scrollYProgress
// - Optional inertial wheel scrolling (respects reduced motion)
// - Auto-focus on pointer enter (a11y-safe)
// - Edge fades (top/bottom) to imply depth without showing scrollbar
// - Hard lock: no horizontal scrolling

import * as React from "react";
import { useScroll, type MotionValue } from "motion/react";
import { useInertialScroll } from "@/motion/useInertialScroll";

type RenderArgs = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
};

type Props = {
  reducedMotion: boolean;
  heightClassName?: string;
  ariaLabel: string;

  inertia?: boolean;
  inertiaEasing?: number;
  inertiaWheelMultiplier?: number;

  onProgress?: (p01: number) => void;

  children: (args: RenderArgs) => React.ReactNode;
};

export function ParallaxPanel({
  reducedMotion,
  ariaLabel,
  inertia = true,
  inertiaEasing = 0.3,
  inertiaWheelMultiplier = 1.5,
  onProgress,
  heightClassName = "h-[70vh] sm:h-[72vh] lg:h-[75vh]",
  children,
}: Props) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Optional inertia (wheel only)
  useInertialScroll(scrollRef, {
    reducedMotion,
    enabled: inertia,
    easing: inertiaEasing,
    wheelMultiplier: inertiaWheelMultiplier,
  });

  // Auto-focus on pointer enter (a11y-safe)
  const onPointerEnter = React.useCallback(() => {
    scrollRef.current?.focus({ preventScroll: true });
  }, []);

  // Publish progress to parent if requested
  React.useEffect(() => {
    if (!onProgress) return;
    const unsub = scrollYProgress.on("change", (v) => onProgress(v));
    return () => unsub();
  }, [scrollYProgress, onProgress]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        tabIndex={0}
        onPointerEnter={onPointerEnter}
        aria-label={ariaLabel}
        className={[
          "relative",
          heightClassName,
          // ✅ hard lock horizontal scrolling; keep vertical scrollbar enabled
          "overflow-y-auto overflow-x-hidden overscroll-contain",
          // ✅ remove scrollbar-none to restore the vertical scrollbar
          // optional: small, subtle scrollbar (Tailwind plugin-dependent)
          "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
          // visible focus ring for keyboard users
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        ].join(" ")}
      >
        {/* Edge fades (depth cue) — feathered to avoid a visible “bar” */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          <div
            className="absolute top-0 left-0 right-0 h-14"
            style={{
              background:
                "linear-gradient(to bottom, rgba(5,6,10,0.0) 0%, rgba(5,6,10,0.0) 35%, rgba(5,6,10,0.55) 100%)",
              filter: "blur(6px)",
              transform: "translateY(-10px)",
              opacity: 0.9,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background:
                "linear-gradient(to top, rgba(5,6,10,0.0) 0%, rgba(5,6,10,0.0) 35%, rgba(5,6,10,0.70) 100%)",
              filter: "blur(6px)",
              transform: "translateY(10px)",
              opacity: 0.9,
            }}
          />
        </div>

        {children({ scrollRef, scrollYProgress })}
      </div>
    </div>
  );
}
