// src/motion/sceneScrollProvider.tsx
//
// Components-only file (keeps React Fast Refresh happy)

import * as React from "react";
import { SceneScrollContext, type SceneScrollState } from "./sceneScrollContext";

export function SceneScrollProvider({ children }: { children: React.ReactNode }) {
  const [progressById, setMap] = React.useState<Record<string, number>>({});

  const setProgress = React.useCallback<SceneScrollState["setProgress"]>((id, progress01) => {
    const v = Math.max(0, Math.min(1, progress01));
    setMap((prev) => (prev[id] === v ? prev : { ...prev, [id]: v }));
  }, []);

  return (
    <SceneScrollContext.Provider value={{ progressById, setProgress }}>
      {children}
    </SceneScrollContext.Provider>
  );
}
