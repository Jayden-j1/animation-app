// src/motion/useSceneScroll.ts
//
// Hook wrapper to consume SceneScrollContext safely.

import * as React from "react";
import { SceneScrollContext } from "./sceneScrollContext";

export function useSceneScroll() {
  const ctx = React.useContext(SceneScrollContext);
  if (!ctx) {
    throw new Error("useSceneScroll must be used within <SceneScrollProvider>.");
  }
  return ctx;
}
