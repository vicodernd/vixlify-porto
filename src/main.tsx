import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
// The homepage (App) is the primary route (Meta Ads + GTmetrix target), so it
// loads eagerly: Vite modulepreloads its chunk immediately instead of only
// discovering it after main.tsx executes, which was adding an avoidable
// fetch-then-eval round trip in front of the Hero's first paint. /templates
// and /vixwispr stay lazy since most visits never touch them.
import App from "./App";

const TemplatesPage = lazy(() =>
  import("./pages/TemplatesPage").then((m) => ({ default: m.TemplatesPage })),
);
const VixwisprPage = lazy(() =>
  import("./pages/VixwisprPage").then((m) => ({ default: m.VixwisprPage })),
);

const path = window.location.pathname.replace(/\/+$/, "");

const page =
  path === "/templates" ? <TemplatesPage /> : path === "/vixwispr" ? <VixwisprPage /> : <App />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="fixed inset-0 bg-[#0a0a0a]" />}>{page}</Suspense>
  </StrictMode>,
);
