import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import NichePage from "./pages/NichePage";

// the generated page names its niche on the root element (see vite.config.ts)
const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <NichePage slug={root.dataset.niche!} />
  </StrictMode>
);
