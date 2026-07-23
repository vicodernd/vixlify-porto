import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const App = lazy(() => import("./App"));
const TemplatesPage = lazy(() =>
  import("./pages/TemplatesPage").then((m) => ({ default: m.TemplatesPage })),
);

const path = window.location.pathname.replace(/\/+$/, "");
const isTemplates = path === "/templates";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="fixed inset-0 bg-[#0a0a0a]" />}>
      {isTemplates ? <TemplatesPage /> : <App />}
    </Suspense>
  </StrictMode>,
);
