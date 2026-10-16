import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const PAGE_META = {
  "/dashboard": ["Dashboard", "A quick overview of your store today"],
  "/products": ["Products", "Manage your jewellery catalogue"],
  "/categories": ["Categories", "Organise how products are grouped"],
  "/collections": ["Collections", "Curated product groupings"],
  "/orders": ["Orders", "Track and fulfil customer orders"],
  "/customers": ["Customers", "Everyone who shops with Roshni Creations"],
};

function metaFor(pathname) {
  const base = "/" + pathname.split("/")[1];
  return PAGE_META[base] || ["Roshni Creations", ""];
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [title, subtitle] = metaFor(location.pathname);

  return (
    <div className="tw:min-h-screen tw:flex tw:bg-[#FAF7F1]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={logout}
      />
      <div className="tw:flex-1 tw:min-w-0 tw:flex tw:flex-col tw:min-h-screen tw:lg:ml-60">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="tw:p-4 tw:sm:p-6 tw:flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
