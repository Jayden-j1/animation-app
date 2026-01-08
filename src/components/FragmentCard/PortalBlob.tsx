// src/components/FragmentCard/PortalBlob.tsx
//
// PURPOSE
// -------
// Circular, glassy "portal orb" with a strong 3D spherical read.
// - Pointer-tracked parallax tilt
// - Dimension-specific behaviour via `motionProfile`
// - Shared element transition via layoutId={`portal-${id}`}
// - Keyboard accessible (button + focus-visible)
//
// PERFORMANCE
// -----------
// - Uses transforms/opacity for compositor-friendly animation.
// - Glow/blur is intentionally modest to avoid GPU overload.

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  animate,
} from "motion/react";
import type { MotionProfile } from "@/pages/Home/fragments";

type Props = {
  id: string;
  title: string;
  subtitle: string;
  glowA: string;
  glowB: string;
  motionProfile: MotionProfile;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

export function PortalBlob({
  id,
  title,
  subtitle,
  glowA,
  glowB,
  motionProfile,
  onSelect,
  disabled,
}: Props) {
  // Pointer → motion values (no React re-render per frame)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Idle drift (adds "alive" presence without being distracting)
  const drift = useMotionValue(0);

  // Spring pointer movement for premium feel
  const sx = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 22, mass: 0.6 });

  // Compute tilt degrees from pointer
  const rotateX = useMotionTemplate`calc(${sy} * -${motionProfile.tilt}deg)`;
  const rotateY = useMotionTemplate`calc(${sx} * ${motionProfile.tilt}deg)`;

  // Subtle scale pulse (mysticism) — controlled by motionProfile.pulse
  const pulse = useMotionValue(1);

  React.useEffect(() => {
    // A gentle ongoing pulse — kept subtle
    const controls = animate(pulse, [1, 1 + 0.02 * motionProfile.pulse, 1], {
      duration: 4.2,
      repeat: Infinity,
      ease: "easeInOut",
    });

    // Idle drift (vertical)
    const driftControls = animate(drift, [0, -motionProfile.drift, 0], {
      duration: 6.0,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => {
      controls.stop();
      driftControls.stop();
    };
  }, [pulse, drift, motionProfile.pulse, motionProfile.drift]);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    // Convert to -1..1 range
    mx.set((px - 0.5) * 2);
    my.set((py - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const lift = motionProfile.lift;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        type="button"
        disabled={disabled}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={() => onSelect(id)}
        className={[
          "relative grid place-items-center",
          "aspect-square w-[220px] sm:w-[240px] lg:w-[260px]",
          "rounded-full",
          "border border-white/10 bg-white/[0.02]",
          "outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        ].join(" ")}
        style={{
          transformStyle: "preserve-3d",
        }}
        whileHover={{ y: -lift }}
        whileFocus={{ y: -lift }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.7 }}
        aria-label={`Enter ${title}`}
      >
        {/* Shared element sphere surface */}
        <motion.div
          layoutId={`portal-${id}`}
          className="absolute inset-0 rounded-full"
          style={{
            // Spherical illusion: layered gradients with specular highlight + rim.
            background: `
              radial-gradient(120px 120px at 30% 28%, rgba(255,255,255,0.20), transparent 55%),
              radial-gradient(220px 220px at 70% 75%, ${glowB}20, transparent 60%),
              radial-gradient(260px 260px at 40% 65%, ${glowA}24, transparent 62%),
              radial-gradient(380px 380px at 50% 55%, rgba(255,255,255,0.06), transparent 62%)
            `,
            boxShadow: `
              0 0 40px rgba(255,255,255,0.06),
              0 0 90px ${glowA}18,
              0 0 110px ${glowB}12
            `,
            filter: "saturate(1.15)",
          }}
        />

        {/* 3D tilt + pulse layer */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            scale: pulse,
            y: drift,
          }}
        >
          {/* Outer aura */}
          <div
            className="absolute -inset-10 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${glowA}${Math.round(
                20 + motionProfile.glow * 18
              ).toString(16)} , transparent 62%)`,
              filter: "blur(26px)",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute -inset-12 rounded-full"
            style={{
              background: `radial-gradient(circle at 55% 45%, ${glowB}22, transparent 62%)`,
              filter: "blur(30px)",
              opacity: 0.55,
            }}
          />

          {/* Rim light (gives strong sphere edge) */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
            }}
          />

          {/* Inner depth vignette */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 55%, transparent 45%, rgba(0,0,0,0.35) 75%)",
              opacity: 0.8,
            }}
          />
        </motion.div>
      </motion.button>

      {/* Text below orb (keeps orb clean and iconic) */}
      <div className="text-center">
        <div className="text-sm font-medium tracking-tight text-white/90">
          {title}
        </div>
        <div className="mt-1 text-xs leading-relaxed text-white/60 max-w-[24ch]">
          {subtitle}
        </div>
      </div>
    </div>
  );
}
