// src/pages/AnimatedRoutes.tsx
//
// Wrap react-router <Routes> with AnimatePresence so routes can animate out.
// Exit transitions can read the current scene scroll progress from SceneScrollProvider.

import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import { HomePage } from "@/pages/Home/HomePage";
import { DimensionPage } from "@/pages/Dimensions/DimensionPage";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/d/:id" element={<DimensionPage />} />
      </Routes>
    </AnimatePresence>
  );
}
