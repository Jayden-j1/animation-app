// src/app/router.tsx
//
// PURPOSE
// -------
// React Router configuration.
// Uses HashRouter for GitHub Pages compatibility.

import { createHashRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";

import { HomePage } from "@/pages/Home/HomePage";
import { DimensionPage } from "@/pages/Dimensions/DimensionPage";

export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/d/:id", element: <DimensionPage /> },
    ],
  },
]);
