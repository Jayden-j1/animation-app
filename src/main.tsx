// src/main.tsx
//
// PURPOSE
// -------
// App entry point.
// - Imports global Tailwind CSS
// - Mounts the React app
// - Uses React StrictMode for dev correctness checks

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/global.css";

// ✅ NEW: provider for scene scroll state (exit transitions etc.)
import { SceneScrollProvider } from "@/motion/sceneScrollProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SceneScrollProvider>
      <App />
    </SceneScrollProvider>
  </React.StrictMode>
);
