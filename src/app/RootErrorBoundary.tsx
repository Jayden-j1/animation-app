// src/app/RootErrorBoundary.tsx
//
// PURPOSE
// -------
// Prevent a blank screen in preview/prod by catching render-time errors.
// Shows a minimal readable fallback and prints details to console.

import * as React from "react";
import { Link } from "react-router-dom";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: unknown };

export class RootErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("[RootErrorBoundary] Uncaught render error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message =
      this.state.error instanceof Error ? this.state.error.message : String(this.state.error);

    return (
      <main className="min-h-dvh bg-[#05060a] text-white px-6 py-14">
        <h1 className="text-2xl font-semibold">Something crashed while rendering.</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">
          Check the browser console for the full stack trace.
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
          {message}
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex text-sm text-white/70 hover:text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }
}
