// src/app/router.tsx
//
// PURPOSE
// -------
// React Router configuration.
// - Uses HashRouter (required for GitHub Pages)
// - Exports router ONLY (no components in this file)

import { createHashRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";

import { HomePage } from "@/pages/Home/HomePage";
import { DimensionPage } from "@/pages/Dimensions/DimensionPage";
import { RouteError } from "@/pages/Error/RouteError";

export const router = createHashRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/d/:id", element: <DimensionPage /> },
    ],
  },
]);
