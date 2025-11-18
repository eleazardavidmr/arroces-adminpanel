import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider } from "./Components/Context";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ProductProvider>
  </StrictMode>
);
