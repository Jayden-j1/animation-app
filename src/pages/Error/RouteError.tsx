// src/pages/Error/RouteError.tsx
//
// PURPOSE
// -------
// Route-level error fallback for React Router.
// Kept in its own file so Vite Fast Refresh stays enabled.

export function RouteError() {
  return (
    <main className="min-h-dvh bg-[#05060a] text-white px-6 py-14">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-white/70">
        A route error occurred. Open the console to see details.
      </p>

      <a
        href="#/"
        className="mt-6 inline-block text-sm text-white/70 hover:text-white"
      >
        ← Back
      </a>
    </main>
  );
}
