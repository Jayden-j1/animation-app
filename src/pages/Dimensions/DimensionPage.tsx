// src/pages/Dimensions/DimensionPage.tsx

import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";

import { DIMENSIONS, type DimensionId } from "@/pages/Home/fragments";
import { usePrefersReducedMotion } from "@/motion/reduceMotion";
import { LightPillar } from "@/components/Background/LightPillar";
import { NatureScene } from "@/features/dimensions/nature/scene";
import { NatureArrival } from "@/features/dimensions/nature/NatureArrival";
import { useSceneScroll } from "@/motion/sceneScroll";

export function DimensionPage() {
  const { id } = useParams();
  const reduced = usePrefersReducedMotion();
  const { progressById } = useSceneScroll();

  const dimension = DIMENSIONS.find((d) => d.id === (id as DimensionId)) ?? null;

  if (!dimension) {
    return (
      <main className="min-h-dvh bg-[#05060a] text-white px-6 py-14">
        <p className="text-white/70">Unknown dimension.</p>
        <Link className="mt-6 inline-block text-sm text-white/70 hover:text-white" to="/">
          ← Back
        </Link>
      </main>
    );
  }

  const { glowA, glowB, title, intro } = dimension;

  // 0..1 (defaults to 0 if unknown)
  const p = progressById[dimension.id] ?? 0;

  // Exit “portal pull” intensifies slightly if you’ve scrolled deeper.
  const exitScale = 0.98 - p * 0.06; // 0.98 → 0.92
  const exitY = 10 + p * 24;         // 10px → 34px
  const exitBlur = 6 + p * 10;       // 6px → 16px

  return (
    <motion.main
      className="relative min-h-dvh overflow-hidden bg-[#05060a] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reduced
          ? { opacity: 0 }
          : {
              opacity: 0,
              scale: exitScale,
              y: exitY,
              filter: `blur(${exitBlur}px) saturate(1.1)`,
            }
      }
      transition={reduced ? { duration: 0.12 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute inset-0">
        <LightPillar
          topColor={glowA}
          bottomColor={glowB}
          intensity={0.9}
          rotationSpeed={0.18}
          interactive={false}
          glowAmount={0.005}
          noiseIntensity={0.5}
          pillarWidth={3.2}
          pillarHeight={0.42}
          mixBlendMode="screen"
          opacity={0.55}
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(900px 520px at 25% 25%, ${glowA}14, transparent 62%),
              radial-gradient(900px 520px at 75% 25%, ${glowB}12, transparent 62%),
              radial-gradient(1100px 700px at 50% 75%, rgba(255,255,255,0.05), transparent 70%)
            `,
          }}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_58%,transparent_78%)] bg-black/55" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pt-10 pb-14">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-white/65 hover:text-white/90
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
        >
          ← Back
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <motion.div
              layoutId={`portal-${dimension.id}`}
              className="relative aspect-square w-[260px] sm:w-[320px] rounded-full"
              style={{
                background: `
                  radial-gradient(140px 140px at 30% 28%, rgba(255,255,255,0.22), transparent 55%),
                  radial-gradient(260px 260px at 70% 75%, ${glowB}22, transparent 62%),
                  radial-gradient(300px 300px at 40% 65%, ${glowA}26, transparent 64%),
                  radial-gradient(420px 420px at 50% 55%, rgba(255,255,255,0.06), transparent 66%)
                `,
                boxShadow: `
                  0 0 60px ${glowA}12,
                  0 0 120px ${glowB}10,
                  0 0 26px rgba(255,255,255,0.06)
                `,
                filter: "saturate(1.15)",
              }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0.14 }
                  : { type: "spring", stiffness: 120, damping: 18, mass: 1.2 }
              }
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 55%, transparent 44%, rgba(0,0,0,0.35) 76%)",
                }}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <motion.h1
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={
                reduced
                  ? { duration: 0.16 }
                  : { duration: 0.7, delay: 0.10, ease: [0.16, 1, 0.3, 1] }
              }
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0.16 }
                  : { duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }
              }
              className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70"
            >
              {intro}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={
            reduced
              ? { duration: 0.16 }
              : { type: "spring", stiffness: 220, damping: 22, delay: 0.22, mass: 0.9 }
          }
          className="mt-12"
        >
          {dimension.id === "nature" ? (
            <NatureArrival>
              <NatureScene glowA={glowA} glowB={glowB} />
            </NatureArrival>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70">
              Scene coming soon.
            </div>
          )}
        </motion.div>
      </section>
    </motion.main>
  );
}
