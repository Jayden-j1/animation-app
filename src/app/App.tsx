// src/app/App.tsx
//
// PURPOSE
// -------
// App root component.
// Provides the React Router instance to the application.
//
// NOTE
// ----
// Default export here is fine (common convention for App root).

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
