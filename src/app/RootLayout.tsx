// src/app/RootLayout.tsx
//
// PURPOSE
// -------
// Root layout wrapper for the router.
// - Wraps all routes in a single LayoutGroup so shared layoutId transitions
//   can continue across route navigation (Home -> Dimension).
// - PageTransition handles enter/exit between routes.

import { Outlet } from "react-router-dom";
import { LayoutGroup } from "motion/react";
import { PageTransition } from "@/components/Transition/PageTransition";

export function RootLayout() {
  return (
    <LayoutGroup>
      <div className="min-h-dvh">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </LayoutGroup>
  );
}
