import React from "react";
import { createRoot } from "react-dom/client";
import TokioExpressApp from "./TokioExpressApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TokioExpressApp />
  </React.StrictMode>
);
