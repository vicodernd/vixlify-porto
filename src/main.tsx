import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { InquiryModal } from "./components/InquiryModal";

const App = lazy(() => import("./App"));
const FoundingClient = lazy(() =>
  import("./pages/FoundingClient").then((m) => ({ default: m.FoundingClient })),
);
const TemplatesPage = lazy(() =>
  import("./pages/TemplatesPage").then((m) => ({ default: m.TemplatesPage })),
);

const path = window.location.pathname.replace(/\/+$/, "");
const isFounding = path === "/founding" || path === "/founding-client";
const isTemplates = path === "/templates";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="fixed inset-0 bg-[#05070f]" />}>
      {isFounding ? <FoundingClient /> : isTemplates ? <TemplatesPage /> : <App />}
    </Suspense>
    <InquiryModal variant={isFounding ? "founding" : "default"} />
  </StrictMode>,
);
