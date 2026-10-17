import { useRef, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

import "./App.css";

// ==================== CUSTOMER ====================
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/home_page_components/Footer";
import ProductsPage from "./pages/ProductsPage";
import DiscriptionPage from "./pages/DiscriptionPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ScrollToTop from "./components/ScrollToTop";

// ==================== ADMIN ====================
import Login from "./admin/pages/auth/Login";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/layout/AdminLayout";

import Dashboard from "./admin/pages/dashboard/Dashboard";

import ProductList from "./admin/pages/products/ProductList";
import ProductForm from "./admin/pages/products/ProductForm";

import CategoryList from "./admin/pages/categories/CategoryList";
import CategoryForm from "./admin/pages/categories/CategoryForm";

import CollectionList from "./admin/pages/collections/CollectionList";
import CollectionForm from "./admin/pages/collections/CollectionForm";

import OrderList from "./admin/pages/orders/OrderList";
import OrderDetail from "./admin/pages/orders/OrderDetail";

import CustomerList from "./admin/pages/customers/CustomerList";
import CustomerDetail from "./admin/pages/customers/CustomerDetail";

import { registerToast } from "./admin/utils/toast";
import AdminProductDetail from "./admin/pages/products/AdminProductDetail";
import MobileFloatingMenu from "./components/MobileFloatingMenu";
import AssistancePage from "./components/AssistancePage";
import ExhibitionOffer from "./components/ExhibitionOffer";
import CouponRegister from "./pages/CouponRegister";

// ============================================================
// CUSTOMER LAYOUT
// ============================================================

const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <div className="tw:h-24 tw:lg:h-36" />

      <ExhibitionOffer />

      {/* menu button */}
      <MobileFloatingMenu />

      {/* whatsapp button */}
      <a
        href="https://wa.me/917082252235"
        target="_blank"
        rel="noopener noreferrer"
        className="
          tw:fixed
          tw:right-6
          tw:bottom-6
          tw:z-99999
          tw:w-10
          tw:h-10
           tw:lg:w-14
          tw:lg:h-14
          tw:bg-[#087C35]
          tw:rounded-md
          tw:flex
          tw:items-center
          tw:justify-center
          tw:shadow-xl
        "
      >
        <i className="pi pi-whatsapp tw:text-white tw:!text-[30px]" />
      </a>

      <Outlet />

      <Footer />
    </>
  );
};

// ============================================================
// MAIN APP
// ============================================================

const App = () => {
  const toastRef = useRef(null);

  useEffect(() => {
    registerToast(toastRef.current);
  }, []);

  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />

      <ConfirmDialog />
      <ScrollToTop />

      <Routes>
        {/* ==================================================
            CUSTOMER
        ================================================== */}

        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductsPage />} />

          <Route
            path="/products/subcategory/:subcategory"
            element={<ProductsPage />}
          />

          <Route
            path="/products/collection/:collection"
            element={<ProductsPage />}
          />

          <Route
            path="/products/category/:category"
            element={<ProductsPage />}
          />

          <Route path="/description/:id" element={<DiscriptionPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/assistance/:slug" element={<AssistancePage />} />

          <Route path="/orderConfirmed" element={<OrderConfirmationPage />} />
          <Route path="/exhbRegistration" element={<CouponRegister />} />
        </Route>

        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route path="/admin/login" element={<Login />} />

        {/* ==================================================
    PROTECTED ADMIN
================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* /admin/dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* ================= PRODUCTS ================= */}

          {/* /admin/products */}
          <Route path="products" element={<ProductList />} />

          {/* /admin/products/add */}
          <Route path="products/add" element={<ProductForm mode="add" />} />

          {/* /admin/products/:id/edit */}
          <Route
            path="products/:id/edit"
            element={<ProductForm mode="edit" />}
          />

          {/* /admin/products/:id */}
          <Route path="products/:id" element={<AdminProductDetail />} />

          {/* ================= CATEGORIES ================= */}

          {/* /admin/categories */}
          <Route path="categories" element={<CategoryList />} />

          {/* /admin/categories/add */}
          <Route path="categories/add" element={<CategoryForm mode="add" />} />

          {/* /admin/categories/:id/edit */}
          <Route
            path="categories/:id/edit"
            element={<CategoryForm mode="edit" />}
          />

          {/* ================= COLLECTIONS ================= */}

          {/* /admin/collections */}
          <Route path="collections" element={<CollectionList />} />

          {/* /admin/collections/add */}
          <Route
            path="collections/add"
            element={<CollectionForm mode="add" />}
          />

          {/* /admin/collections/:id/edit */}
          <Route
            path="collections/:id/edit"
            element={<CollectionForm mode="edit" />}
          />

          {/* ================= ORDERS ================= */}

          {/* /admin/orders */}
          <Route path="orders" element={<OrderList />} />

          {/* /admin/orders/:id */}
          <Route path="orders/:id" element={<OrderDetail />} />

          {/* ================= CUSTOMERS ================= */}

          {/* /admin/customers */}
          <Route path="customers" element={<CustomerList />} />

          {/* /admin/customers/:id */}
          <Route path="customers/:id" element={<CustomerDetail />} />
        </Route>

        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
