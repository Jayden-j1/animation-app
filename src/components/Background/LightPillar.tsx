// src/components/Background/LightPillar.tsx
//
// PURPOSE
// -------
// Three.js shader background layer (premium glow pillar).
// Intended as subtle atmosphere behind UI.
//
// HARD-LINT COMPLIANCE
// --------------------
// ✅ NO setState calls inside useEffect (even in catch)
// ✅ NO conditional hook calls
// ✅ NO ref reads that drive render branching
//
// BEHAVIOR
// --------
// - We always render a subtle CSS haze (safe fallback).
// - If reduced motion or WebGL unsupported/init-fails, we simply never mount WebGL.
// - If WebGL mounts successfully, it visually dominates the haze.
// - This avoids all "setState in effect" lint rules entirely.
//
// PERFORMANCE
// -----------
// - Low precision, no depth/stencil, alpha true
// - Pixel ratio capped
// - Throttled mouse
// - Proper disposal on unmount

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/motion/reduceMotion";

type Props = {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  pillarRotation?: number;
  opacity?: number;
  // How strong the fallback haze should be under WebGL.
  // Keep low so WebGL can "own" the look.
  hazeOpacity?: number;
};

const FALLBACK_BG =
  "radial-gradient(900px 500px at 30% 25%, rgba(41,255,144,0.10), transparent 60%)," +
  "radial-gradient(900px 500px at 70% 25%, rgba(160,158,255,0.10), transparent 60%)," +
  "radial-gradient(1100px 700px at 50% 70%, rgba(255,255,255,0.05), transparent 70%)";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function LightPillar({
  topColor = "#29ff90",
  bottomColor = "#a09eff",
  intensity = 0.9,
  rotationSpeed = 0.25,
  interactive = false,
  className = "",
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.45,
  mixBlendMode = "screen",
  pillarRotation = 0,
  opacity = 0.55,
  hazeOpacity = 0.55,
}: Props) {
  const reduced = usePrefersReducedMotion();

  // IMPORTANT: This flag does NOT drive render branching.
  // It's only used inside the effect to decide whether to init WebGL.
  const webglSupportedRef = useRef<boolean>(supportsWebGL());

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);

  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const timeRef = useRef<number>(0);

  useEffect(() => {
    // Do not init if reduced motion OR WebGL unsupported OR no container.
    if (reduced) return;
    if (!webglSupportedRef.current) return;
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // Try create renderer. If this fails, just abort (CSS haze remains).
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        precision: "lowp",
        stencil: false,
        depth: false,
      });
    } catch {
      // NO setState here (lint rule). Just abort to CSS haze.
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const parseColor = (hex: string) => {
      const c = new THREE.Color(hex);
      return new THREE.Vector3(c.r, c.g, c.b);
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uPillarRotation;
      varying vec2 vUv;

      const float PI = 3.141592653589793;
      const float EPSILON = 0.001;
      const float E = 2.71828182845904523536;
      const float HALF = 0.5;

      mat2 rot(float a){ float s=sin(a); float c=cos(a); return mat2(c,-s,s,c); }

      float noise(vec2 coord){
        float G = E;
        vec2 r = (G * sin(G * coord));
        return fract(r.x * r.y * (1.0 + coord.x));
      }

      vec3 applyWaveDeformation(vec3 pos, float t){
        float f = 1.0;
        float a = 1.0;
        vec3 d = pos;
        for(float i=0.0;i<4.0;i++){
          d.xz *= rot(0.4);
          float ph = t * i * 2.0;
          vec3 osc = cos(d.zxy * f - ph);
          d += osc * a;
          f *= 2.0;
          a *= HALF;
        }
        return d;
      }

      float blendMin(float a, float b, float k){
        float kk = k * 4.0;
        float h = max(kk - abs(a-b), 0.0);
        return min(a,b) - h*h * 0.25 / kk;
      }
      float blendMax(float a, float b, float k){ return -blendMin(-a,-b,k); }

      void main(){
        vec2 fragCoord = vUv * uResolution;
        vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;

        float rotAngle = uPillarRotation * PI / 180.0;
        uv *= rot(rotAngle);

        vec3 origin = vec3(0.0, 0.0, -10.0);
        vec3 dir = normalize(vec3(uv, 1.0));

        float maxDepth = 50.0;
        float depth = 0.1;

        mat2 rotX = rot(uTime * 0.3);
        if(uInteractive && length(uMouse) > 0.0){
          rotX = rot(uMouse.x * PI * 2.0);
        }

        vec3 col = vec3(0.0);

        for(float i=0.0;i<100.0;i++){
          vec3 pos = origin + dir * depth;
          pos.xz *= rotX;

          vec3 def = pos;
          def.y *= uPillarHeight;
          def = applyWaveDeformation(def + vec3(0.0, uTime, 0.0), uTime);

          vec2 cp = cos(def.xz);
          float fd = length(cp) - 0.2;

          float rb = length(pos.xz) - uPillarWidth;
          fd = blendMax(rb, fd, 1.0);
          fd = abs(fd) * 0.15 + 0.01;

          vec3 grad = mix(uBottomColor, uTopColor, smoothstep(15.0, -15.0, pos.y));
          col += grad * pow(1.0 / fd, 1.0);

          if(fd < EPSILON || depth > maxDepth) break;
          depth += fd;
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);

        float rnd = noise(gl_FragCoord.xy);
        col -= rnd / 15.0 * uNoiseIntensity;

        gl_FragColor = vec4(col * uIntensity, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uPillarRotation: { value: pillarRotation },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse interaction (throttled)
    let mouseMoveTimeout: number | null = null;
    const onMove = (event: MouseEvent) => {
      if (!interactive) return;
      if (mouseMoveTimeout) return;

      mouseMoveTimeout = window.setTimeout(() => (mouseMoveTimeout = null), 16);

      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);
    };

    if (interactive) {
      container.addEventListener("mousemove", onMove, { passive: true });
    }

    // Animation loop
    let lastTime = performance.now();
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const loop = (now: number) => {
      if (
        !materialRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current
      ) {
        return;
      }

      const dt = now - lastTime;
      if (dt >= frameTime) {
        timeRef.current += 0.016 * rotationSpeed;
        materialRef.current.uniforms.uTime.value = timeRef.current;

        // Render; if it throws, abort the loop (CSS haze remains).
        try {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        } catch {
          return;
        }

        lastTime = now - (dt % frameTime);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // Resize (debounced)
    let resizeTimeout: number | null = null;
    const onResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!rendererRef.current || !materialRef.current || !containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        rendererRef.current.setSize(w, h);
        materialRef.current.uniforms.uResolution.value.set(w, h);
      }, 150);
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (interactive) container.removeEventListener("mousemove", onMove);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      geometryRef.current?.dispose();
      materialRef.current?.dispose();

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      rendererRef.current = null;
      materialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      geometryRef.current = null;
      rafRef.current = null;
    };
  }, [
    reduced,
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    interactive,
    glowAmount,
    pillarWidth,
    pillarHeight,
    noiseIntensity,
    pillarRotation,
  ]);

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {/* CSS haze fallback ALWAYS present (subtle), so we never need setState to "switch". */}
      <div
        className="absolute inset-0"
        style={{
          opacity: hazeOpacity * opacity,
          mixBlendMode,
          background: FALLBACK_BG,
        }}
      />

      {/* WebGL target container (only used if effect successfully mounts a renderer). */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ opacity, mixBlendMode }}
      />
    </div>
  );
}
