// src/app/router.tsx
//
// PURPOSE
// -------
// React Router configuration.
// Uses RootLayout to wrap routed content in PageTransition.
//
// CONVENTION
// ----------
// - Pages/components: named exports (recommended standard)
// - This file exports only router config (not components)

import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";

import { HomePage } from "@/pages/Home/HomePage";
import { DimensionPage } from "@/pages/Dimensions/DimensionPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/d/:id", element: <DimensionPage /> },
    ],
  },
]);
