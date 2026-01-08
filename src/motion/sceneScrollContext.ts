// src/motion/sceneScrollContext.ts
//
// Context lives in its own file to keep React Fast Refresh happy.

import * as React from "react";

export type SceneScrollState = {
  progressById: Record<string, number>;
  setProgress: (id: string, progress01: number) => void;
};

export const SceneScrollContext = React.createContext<SceneScrollState | undefined>(undefined);
