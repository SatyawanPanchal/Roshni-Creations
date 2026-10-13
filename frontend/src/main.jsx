import "./assets/index.css";
import { PrimeReactProvider } from "primereact/api";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// prime react installation
import "primeicons/primeicons.css";
// import "primereact/resources/themes/lara-light-amber/theme.css";
import "primereact/resources/themes/lara-light-teal/theme.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AddressProvider } from "./context/AddressContext.jsx";
import { ProductProvider } from "./context/productContext.jsx";

createRoot(document.getElementById("root")).render(
  <PrimeReactProvider value={{ ripple: true }}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
            <ProductProvider>
              <App />
            </ProductProvider>
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </PrimeReactProvider>,
);
