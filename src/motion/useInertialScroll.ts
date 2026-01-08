// src/motion/useInertialScroll.ts

import * as React from "react";

type Options = {
  reducedMotion: boolean;
  enabled?: boolean;
  easing?: number; // default 0.14
  wheelMultiplier?: number; // default 1
};

export function useInertialScroll(
  ref: React.RefObject<HTMLElement | null>,
  { reducedMotion, enabled = true, easing = 0.14, wheelMultiplier = 1 }: Options
) {
  const rafRef = React.useRef<number | null>(null);
  const targetRef = React.useRef<number>(0);
  const runningRef = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion || !enabled) return;

    const stop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      runningRef.current = false;
    };

    const tick = () => {
      const node = ref.current;
      if (!node) return stop();

      const current = node.scrollTop;
      const target = targetRef.current;
      const next = current + (target - current) * easing;

      if (Math.abs(target - current) < 0.5) {
        node.scrollTop = target;
        return stop();
      }

      node.scrollTop = next;
      rafRef.current = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const syncTargetToActual = () => {
      const node = ref.current;
      if (!node) return;
      // If user scrolls via scrollbar drag/keyboard/touch, keep target aligned
      targetRef.current = node.scrollTop;
    };

    const onWheel = (e: WheelEvent) => {
      const node = ref.current;
      if (!node) return;

      // Ignore mostly-horizontal wheels to prevent sideways drift
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      const maxScroll = node.scrollHeight - node.clientHeight;
      const nextTarget = targetRef.current + e.deltaY * wheelMultiplier;
      targetRef.current = Math.max(0, Math.min(maxScroll, nextTarget));

      ensureRunning();
    };

    targetRef.current = el.scrollTop;

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", syncTargetToActual, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", syncTargetToActual);
      stop();
    };
  }, [ref, reducedMotion, enabled, easing, wheelMultiplier]);
}
