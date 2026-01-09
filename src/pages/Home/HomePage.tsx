// src/pages/Home/HomePage.tsx
//
// PURPOSE
// -------
// Premium, atmospheric Home with circular portal orbs.
// Click flow (Option A):
// hover breath → click zoom → dissolve → route
// Then the destination page's NatureArrival finishes the entry.

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { DIMENSIONS } from "./fragments";
import { PortalBlob } from "@/components/FragmentCard/PortalBlob";
import { usePrefersReducedMotion } from "@/motion/reduceMotion";
import { LightPillar } from "@/components/Background/LightPillar";

type Phase = "idle" | "zoom" | "dissolve";

export function HomePage() {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Guard against double navigation (StrictMode / layout replays)
  const navigatedRef = React.useRef(false);

  const active = activeId ? DIMENSIONS.find((d) => d.id === activeId) ?? null : null;

  const goToDimension = (id: string) => {
    if (isNavigating) return;

    if (reduced) {
      navigate(`/d/${id}`);
      return;
    }

    navigatedRef.current = false;
    setIsNavigating(true);
    setActiveId(id);
    setPhase("zoom");
  };

  const finishNavigate = (id: string) => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    navigate(`/d/${id}`);
  };

  const closeOverlay = () => {
    setPhase("idle");
    setActiveId(null);
    setIsNavigating(false);
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#05060a] text-white">
      {/* Three.js mystic layer (subtle). Safe fallbacks included. */}
      <div className="pointer-events-none absolute inset-0">
        <LightPillar
          topColor="#29ff90"
          bottomColor="#a09eff"
          intensity={0.85}
          rotationSpeed={0.12}
          interactive={false}
          mixBlendMode="screen"
          opacity={0.45}
          pillarWidth={3.1}
          pillarHeight={0.38}
          noiseIntensity={0.5}
        />
      </div>

      {/* Atmospheric background (CSS-only, cheap + premium) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_30%,rgba(41,255,144,0.10),transparent_60%),radial-gradient(900px_500px_at_80%_25%,rgba(160,158,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_55%,transparent_75%)] bg-black/60" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pt-14 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Imagination Dimensions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65"
        >
          Each sphere is a portal. Click to enter.
        </motion.p>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
          }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 place-items-center"
        >
          {DIMENSIONS.map((d) => (
            <motion.div
              key={d.id}
              variants={{
                hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { type: "spring", stiffness: 240, damping: 22 },
                },
              }}
            >
              <PortalBlob
                id={d.id}
                title={d.title}
                subtitle={d.subtitle}
                glowA={d.glowA}
                glowB={d.glowB}
                motionProfile={d.motion}
                onSelect={goToDimension}
                disabled={isNavigating}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Fullscreen portal overlay: zoom → dissolve → route */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: phase === "dissolve" ? 0.88 : 0.72,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "rgba(0,0,0,1)" }}
            />

            {/* Shared element expands */}
            <motion.div
              layoutId={`portal-${active.id}`}
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(1200px 700px at 50% 30%, ${active.glowA}33, transparent 60%),
                  radial-gradient(1000px 650px at 55% 45%, ${active.glowB}2a, transparent 62%),
                  radial-gradient(800px 520px at 50% 55%, rgba(255,255,255,0.06), transparent 62%)
                `,
                filter: "saturate(1.2)",
              }}
              transition={{ type: "spring", stiffness: 110, damping: 18, mass: 1.25 }}
            >
              {/* Phase 1: zoom energy */}
              {phase === "zoom" && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1, opacity: 0.0 }}
                  animate={{ scale: active.motion.enterZoom, opacity: 1.0 }}
                  transition={{
                    duration: active.motion.dissolveMs / 1000,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    background: `radial-gradient(circle at 50% 45%, ${active.glowA}66, transparent 56%)`,
                    filter: "blur(18px)",
                  }}
                  onAnimationComplete={() => setPhase("dissolve")}
                />
              )}

              {/* Phase 2: iris dissolve (circle expands) */}
              {phase === "dissolve" && (
                <motion.div
                  className="absolute inset-0"
                  initial={{
                    opacity: 1,
                    clipPath: "circle(18% at 50% 45%)",
                    filter: "brightness(0.96) contrast(1.06)",
                  }}
                  animate={{
                    opacity: 1,
                    clipPath: "circle(140% at 50% 45%)",
                    filter: "brightness(1) contrast(1)",
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onAnimationComplete={() => finishNavigate(active.id)}
                />
              )}

              <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-white/60">
                entering {active.title.toLowerCase()}…
              </div>
            </motion.div>

            {/* Safety: if navigation happens, clear overlay state on unmount */}
            <motion.div
              className="sr-only"
              onAnimationComplete={() => {
                // If user navigated away, Home unmounts anyway.
                // If they somehow stay, allow clicks again.
                if (phase === "dissolve") closeOverlay();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
