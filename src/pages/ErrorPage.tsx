// src/pages/ErrorPage.tsx

import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const err = useRouteError();

  return (
    <main className="min-h-dvh bg-[#05060a] text-white px-6 py-14">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-4 text-white/70">
        The app hit a routing/runtime error. Check the console for details.
      </p>

      <pre className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/70 overflow-auto">
        {JSON.stringify(err, null, 2)}
      </pre>

      <Link
        to="/"
        className="mt-8 inline-block text-sm text-white/70 hover:text-white"
      >
        ← Back home
      </Link>
    </main>
  );
}
