// src/pages/Home/fragments.ts
//
// PURPOSE
// -------
// Defines the Imagination Dimensions shown on Home.
// Includes a per-dimension "motion profile" that controls how each portal orb behaves.
//
// DESIGN GOAL
// -----------
// Each dimension has a distinct "portable behaviour":
// - Hover feel (lift, tilt intensity, glow intensity, pulse speed)
// - Entry feel (dissolve duration / zoom intensity)
// This stays small + maintainable while allowing personality per dimension.

export type DimensionId = "nature" | "culture" | "technology" | "language" | "thinkers";

export type MotionProfile = {
  // Hover / focus feel
  lift: number;           // px
  tilt: number;           // degrees (max)
  glow: number;           // 0..1 overall glow strength
  pulse: number;          // 0..1 pulse intensity
  drift: number;          // px subtle idle drift amplitude

  // Entry / click feel
  enterZoom: number;      // scale multiplier during entry
  dissolveMs: number;     // duration for dissolve phase
};

export type Dimension = {
  id: DimensionId;
  title: string;
  subtitle: string;
  intro: string;          // shown on Dimension page

  glowA: string;
  glowB: string;

  motion: MotionProfile;
};

export const DIMENSIONS: Dimension[] = [
  {
    id: "nature",
    title: "Nature & Environment",
    subtitle: "Organic flow, cycles, breath",
    intro:
      "Soft motion, cyclical rhythm, and a sense of living systems—enter gently and let it unfold.",
    glowA: "#29ff90",
    glowB: "#a09eff",
    motion: {
      lift: 6,
      tilt: 12,
      glow: 0.85,
      pulse: 0.6,
      drift: 10,
      enterZoom: 1.35,
      dissolveMs: 620,
    },
  },
  {
    id: "culture",
    title: "Culture",
    subtitle: "Grounded, respectful presence",
    intro:
      "Arrive with care. Motion here is restrained—intentional, calm, and grounded in respect.",
    glowA: "#ffd28a",
    glowB: "#ff6fb1",
    motion: {
      lift: 4,
      tilt: 7,
      glow: 0.55,
      pulse: 0.25,
      drift: 6,
      enterZoom: 1.22,
      dissolveMs: 520,
    },
  },
  {
    id: "technology",
    title: "Technology",
    subtitle: "Precision, systems, networks",
    intro:
      "Crisp transitions, structured motion, and clean energy—like systems snapping into place.",
    glowA: "#63e6ff",
    glowB: "#7c5cff",
    motion: {
      lift: 7,
      tilt: 10,
      glow: 0.8,
      pulse: 0.35,
      drift: 4,
      enterZoom: 1.32,
      dissolveMs: 480,
    },
  },
  {
    id: "language",
    title: "Language & Eloquence",
    subtitle: "Cadence, clarity, power of words",
    intro:
      "Motion follows cadence—reveals, emphasis, and breath between ideas. Let language arrive in layers.",
    glowA: "#f7ff8f",
    glowB: "#ff8bd4",
    motion: {
      lift: 6,
      tilt: 9,
      glow: 0.75,
      pulse: 0.7,
      drift: 7,
      enterZoom: 1.30,
      dissolveMs: 640,
    },
  },
  {
    id: "thinkers",
    title: "Great Thinkers",
    subtitle: "Ideas, archetypes, insight",
    intro:
      "A slow emergence. Patterns connect, then clarify—like ideas assembling into meaning.",
    glowA: "#b7a6ff",
    glowB: "#6cffc8",
    motion: {
      lift: 8,
      tilt: 11,
      glow: 0.9,
      pulse: 0.45,
      drift: 8,
      enterZoom: 1.38,
      dissolveMs: 700,
    },
  },
];
