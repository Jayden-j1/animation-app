// src/app/RootLayout.tsx
//
// PURPOSE
// -------
// Root layout wrapper for the router.
// - Wraps all routes in a single LayoutGroup so shared layoutId transitions continue.
// - PageTransition handles enter/exit between routes.
// - IMPORTANT: Always paints the app background to prevent white "blank" frames.

import { Outlet } from "react-router-dom";
import { LayoutGroup } from "motion/react";
import { PageTransition } from "@/components/Transition/PageTransition";

export function RootLayout() {
  return (
    <LayoutGroup>
      {/* ✅ Always paint background so exit/enter never reveals white document */}
      <div className="min-h-dvh bg-[#05060a] text-white">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </LayoutGroup>
  );
}
