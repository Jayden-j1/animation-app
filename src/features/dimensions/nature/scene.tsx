// src/features/dimensions/nature/scene.tsx

import * as React from "react";
import {
  motion,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  type MotionValue,
} from "motion/react";

import { ParallaxPanel } from "@/components/Parrallax/ParrallaxPanel";
import { useSceneScroll } from "@/motion/UseSceneScroll";

type Props = {
  glowA: string;
  glowB: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ✅ Vite + GitHub Pages safe public asset URL helper
// - Works locally (BASE_URL="/") and on GH Pages (BASE_URL="/animation-app/")
// - Avoids absolute-root URLs that break on GH Pages.
function publicAsset(pathFromPublic: string) {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = pathFromPublic.replace(/^\/+/, "");
  return `${cleanBase}${cleanPath}`;
}

function NatureParallaxStage({
  glowA,
  glowB,
  reduced,
  scrollYProgress,
}: {
  glowA: string;
  glowB: string;
  reduced: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.9 });

  // ✅ Assets (from /public) — GH Pages safe
  // NOTE: folder is "parallax" (not "parrallax")
  const hill1 = publicAsset("parallax/nature/hill1.png");
  const hill2 = publicAsset("parallax/nature/hill2.png");
  const hill3 = publicAsset("parallax/nature/hill3.png");
  const hill4 = publicAsset("parallax/nature/hill4.png");
  const hill5 = publicAsset("parallax/nature/hill5.png");
  const leaf = publicAsset("parallax/nature/leaf.png");
  const plant = publicAsset("parallax/nature/plant.png");
  const tree = publicAsset("parallax/nature/tree.png");

  // Transcript-style parallax
  const textY = useTransform(p, [0, 1], [0, 220]);
  const leafX = useTransform(p, [0, 1], [0, 260]);
  const leafY = useTransform(p, [0, 1], [0, -260]);

  // Hills
  const h1Y = useTransform(p, [0, 1], [0, 18]);
  const h2Y = useTransform(p, [0, 1], [0, 32]);
  const h3Y = useTransform(p, [0, 1], [0, 55]);
  const h4Y = useTransform(p, [0, 1], [0, 78]);
  const h5Y = useTransform(p, [0, 1], [0, 110]);

  const h3X = useTransform(p, [0, 1], [0, 48]);
  const h4X = useTransform(p, [0, 1], [0, -58]);
  const h5X = useTransform(p, [0, 1], [0, 0]);

  const plantY = useTransform(p, [0, 1], [0, 135]);
  const treeY = useTransform(p, [0, 1], [0, 40]);

  // Cursor-react humidity highlight
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const cxs = useSpring(cx, { stiffness: 140, damping: 26, mass: 0.9 });
  const cys = useSpring(cy, { stiffness: 140, damping: 26, mass: 0.9 });

  const highlightX = useMotionTemplate`calc(50% + ${cxs} * 10%)`;
  const highlightY = useMotionTemplate`calc(45% + ${cys} * 8%)`;

  // Fog bg-position drift (cursor + micro scroll)
  const fogBiasPX = useTransform(cxs, [-1, 1], [-22, 22]);
  const fogBiasPY = useTransform(cys, [-1, 1], [-14, 14]);
  const fogScrollPX = useTransform(p, [0, 1], [0, -18]);
  const fogScrollPY = useTransform(p, [0, 1], [0, 10]);

  // ✅ TS-safe: number[] in, number out
  const fogPosX = useTransform([fogBiasPX, fogScrollPX], ([a, b]: number[]) => a + b);
  const fogPosY = useTransform([fogBiasPY, fogScrollPY], ([a, b]: number[]) => a + b);

  const fogBgPos = useMotionTemplate`calc(20% + ${fogPosX}px) calc(60% + ${fogPosY}px)`;

  // Micro “breath”
  const hueTime = useMotionValue(0);
  const contrastTime = useMotionValue(1);

  const hueScroll = useTransform(p, [0, 1], [-0.35, 0.35]);
  const contrastScroll = useTransform(p, [0, 1], [0.01, -0.01]);

  // ✅ TS-safe: number[] in, number out
  const hue = useTransform([hueTime, hueScroll], ([a, b]: number[]) => a + b);
  const contrast = useTransform([contrastTime, contrastScroll], ([a, b]: number[]) => a + b);

  const filterFx = useMotionTemplate`hue-rotate(${hue}deg) contrast(${contrast})`;

  React.useEffect(() => {
    if (reduced) return;

    let raf = 0;
    const start = performance.now();

    const loop = (t: number) => {
      const elapsed = (t - start) / 1000;
      hueTime.set(Math.sin(elapsed / 10) * 1.7);
      contrastTime.set(1 + Math.sin(elapsed / 12 + 1.7) * 0.018);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, hueTime, contrastTime]);

  const spores = React.useMemo(() => {
    const count = 16;
    const baseSeed = 1337;
    return Array.from({ length: count }).map((_, i) => {
      const rnd = mulberry32(baseSeed + i * 97);
      const x = rnd() * 100;
      const y = rnd() * 100;
      const s = 0.45 + rnd() * 0.95;
      const o = 0.14 + rnd() * 0.28;
      const d = 4.2 + rnd() * 6.0;
      const delay = rnd() * 2.2;
      const bias = (rnd() - 0.5) * 2;
      return { i, x, y, s, o, d, delay, bias };
    });
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cx.set((px - 0.5) * 2);
    cy.set((py - 0.5) * 2);
  };

  const onPointerLeave = () => {
    cx.set(0);
    cy.set(0);
  };

  const shimmerTransition = { duration: 9.5, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.div
      className="relative"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ filter: reduced ? "none" : (filterFx as unknown as string) }}
    >
      <div className="relative h-[140vh]">
        <div className="sticky top-0 h-[70vh] sm:h-[72vh] lg:h-[75vh] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px 700px at 50% 18%, rgba(10,14,12,0.55), rgba(5,6,10,0.95))",
            }}
          />

          <motion.div
            className="absolute left-1/2 top-[16%] -translate-x-1/2 text-center px-6"
            style={{ y: reduced ? 0 : textY }}
          >
            <div className="text-xs uppercase tracking-[0.24em] text-white/65">The Big Scrub</div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-white/92 drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              Rainforest Parallax
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 mx-auto">
              Scroll inside this scene to feel layers separate: hills, canopy, fog, and foreground life.
            </p>
          </motion.div>

          <motion.img
            src={leaf}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute right-[-6%] top-[-10%] w-[560px] sm:w-[640px] lg:w-[720px] max-w-none select-none opacity-[0.9]"
            style={{ x: reduced ? 0 : leafX, y: reduced ? 0 : leafY }}
          />

          <motion.img
            src={hill1}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.55]"
            style={{ y: reduced ? 0 : h1Y }}
          />
          <motion.img
            src={hill2}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.65]"
            style={{ y: reduced ? 0 : h2Y }}
          />
          <motion.img
            src={hill3}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.78]"
            style={{ y: reduced ? 0 : h3Y, x: reduced ? 0 : h3X }}
          />
          <motion.img
            src={hill4}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.82]"
            style={{ y: reduced ? 0 : h4Y, x: reduced ? 0 : h4X }}
          />
          <motion.img
            src={hill5}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.9]"
            style={{ y: reduced ? 0 : h5Y, x: reduced ? 0 : h5X }}
          />

          <motion.img
            src={tree}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.82]"
            style={{ y: reduced ? 0 : treeY }}
          />

          <motion.img
            src={plant}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            loading="eager"
            className="pointer-events-none absolute left-0 top-0 w-full max-w-none select-none opacity-[0.96]"
            style={{ y: reduced ? 0 : plantY }}
          />

          <motion.div
            className="absolute inset-0"
            aria-hidden
            style={{
              background: `radial-gradient(520px 420px at ${highlightX} ${highlightY}, rgba(255,255,255,0.055), transparent 62%)`,
              opacity: reduced ? 0 : 1,
              filter: "blur(14px)",
            }}
          />

          {!reduced && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background: `radial-gradient(220px 180px at ${highlightX} ${highlightY}, rgba(255,255,255,0.06), transparent 70%)`,
                filter: "blur(10px)",
                mixBlendMode: "screen",
                opacity: 0.06,
              }}
              animate={{ opacity: [0.045, 0.075, 0.05], scale: [1, 1.015, 1] }}
              transition={shimmerTransition}
            />
          )}

          <motion.div
            className="absolute inset-0"
            aria-hidden
            style={{
              background: `
                radial-gradient(900px 520px at 20% 60%, rgba(255,255,255,0.07), transparent 62%),
                radial-gradient(1000px 600px at 80% 55%, rgba(255,255,255,0.06), transparent 64%),
                radial-gradient(1100px 700px at 50% 85%, rgba(255,255,255,0.05), transparent 72%)
              `,
              backgroundRepeat: "no-repeat",
              backgroundPosition: reduced ? "20% 60%" : (fogBgPos as unknown as string),
              filter: "blur(18px)",
              opacity: 0.82,
            }}
          />

          <div className="absolute inset-0">
            {spores.map((s) => (
              <motion.div
                key={s.i}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.s}rem`,
                  height: `${s.s}rem`,
                  background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.16), transparent 55%),
                               radial-gradient(circle at 50% 50%, ${glowA}24, transparent 62%),
                               radial-gradient(circle at 55% 55%, ${glowB}18, transparent 68%)`,
                  opacity: clamp(s.o, 0.12, 0.5),
                  boxShadow: `0 0 16px ${glowA}12, 0 0 22px ${glowB}0c`,
                  mixBlendMode: "screen",
                }}
                aria-hidden
                animate={
                  reduced
                    ? { opacity: s.o }
                    : {
                        x: [0, 7 + s.bias * 3, 0],
                        y: [0, -9 + s.bias * 2.5, 0],
                        opacity: [s.o * 0.85, s.o, s.o * 0.8],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: s.d, repeat: Infinity, ease: "easeInOut", delay: s.delay }
                }
              />
            ))}
          </div>

          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background: "radial-gradient(circle at 50% 40%, transparent 45%, rgba(0,0,0,0.58) 78%)",
            }}
          />
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-white/60 backdrop-blur-[2px]">
            Scroll inside the scene ↓
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NatureScene({ glowA, glowB }: Props) {
  const reduced = !!useReducedMotion();
  const { setProgress } = useSceneScroll();

  return (
    <motion.div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <ParallaxPanel
        reducedMotion={reduced}
        ariaLabel="Big Scrub scene. Scroll inside this panel to move the parallax layers."
        inertia={true}
        inertiaEasing={0.14}
        inertiaWheelMultiplier={1}
        onProgress={(v) => setProgress("nature", v)}
      >
        {({ scrollYProgress }) => (
          <NatureParallaxStage
            glowA={glowA}
            glowB={glowB}
            reduced={reduced}
            scrollYProgress={scrollYProgress}
          />
        )}
      </ParallaxPanel>

      <div className="border-t border-white/10 px-6 py-4 text-xs text-white/55">
        "From Gabun we collected some of the plants we used to make fish nets 'Jalum Ngarbany' and dilly 'jili' bags." - Uncle Rick Cook?
      </div>
    </motion.div>
  );
}
