import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { FoundingClient } from "./pages/FoundingClient";
import { TemplatesPage } from "./pages/TemplatesPage";
import { InquiryModal } from "./components/InquiryModal";

const path = window.location.pathname.replace(/\/+$/, "");
const isFounding = path === "/founding" || path === "/founding-client";
const isTemplates = path === "/templates";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isFounding ? <FoundingClient /> : isTemplates ? <TemplatesPage /> : <App />}
    <InquiryModal variant={isFounding ? "founding" : "default"} />
  </StrictMode>,
);
