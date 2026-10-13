import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo.webp"

const NAV_ITEMS = [
  { to: "/admin/dashboard", icon: "pi-th-large", label: "Dashboard" },
  { to: "/admin/products", icon: "pi-gem", label: "Products" },
  { to: "/admin/categories", icon: "pi-tags", label: "Categories" },
  { to: "/admin/collections", icon: "pi-th-large", label: "Collections" },
  { to: "/admin/orders", icon: "pi-box", label: "Orders" },
  { to: "/admin/customers", icon: "pi-users", label: "Customers" },
];

export default function Sidebar({ open, onClose, user, onLogout }) {
  return (
    <>
      {open && (
        <div
          className="tw:fixed tw:inset-0 tw:bg-black/30 tw:z-30 tw:lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={
          "tw:fixed tw:top-0 tw:bottom-0 tw:left-0 tw:w-60 tw:bg-[#FFFFFF] tw:border-r tw:border-[#E7E0CE] tw:flex tw:flex-col tw:z-40 tw:transition-transform " +
          (open ? "tw:translate-x-0" : "tw:-translate-x-full tw:lg:translate-x-0")
        }
      >
        <div className="tw:flex tw:items-center tw:gap-2.5 tw:px-5 tw:py-5 tw:border-b tw:border-[#E7E0CE]">
          <div className="tw:w-12 tw:h-12 tw:rounded-full tw:border tw:border-[#AD8A3F] tw:text-[#AD8A3F] tw:flex tw:items-center tw:justify-center font-display tw:text-base tw:flex-shrink-0">
            <img src={logo} alt="Logo" />
          </div>
          <div>
            <div className="font-display tw:text-[15px] tw:leading-tight">Roshni Creations</div>
            <div className="tw:text-[10px] tw:text-[#9AA39B] tw:tracking-wide">ADMIN PANEL</div>
          </div>
        </div>

        <nav className="tw:flex-1 tw:px-3 tw:py-3.5 tw:overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                "tw:flex tw:items-center tw:gap-2.5 tw:px-3 tw:py-2.5 tw:rounded-lg tw:text-[13.5px] tw:mb-0.5 tw:border-l-2 tw:no-underline " +
                (isActive
                  ? "tw:bg-[#E9F1EC] tw:text-[#1F4E47] tw:border-l-[#1F4E47] tw:font-medium"
                  : "tw:text-[#5E6D67] tw:border-l-transparent tw:hover:bg-[#FFFFFF]-[#F3EEE2] tw:hover:text-[#1C2B28]")
              }
            >
              <i className={`pi ${item.icon} tw:text-[15px]`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="tw:border-t tw:border-[#E7E0CE] tw:p-3">
          <div className="tw:flex tw:items-center tw:gap-2.5 tw:px-2.5 tw:py-2">
            <div className="tw:w-8 tw:h-8 tw:rounded-full tw:bg-[#E9F1EC] tw:text-[#1F4E47] tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-semibold tw:flex-shrink-0">
              {(user?.firstName?.[0] || "A") + (user?.lastName?.[0] || "")}
            </div>
            <div className="tw:min-w-0">
              <div className="tw:text-[13px] tw:font-medium tw:truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Admin"}
              </div>
              <div className="tw:text-[11px] tw:text-[#9AA39B] tw:truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="tw:w-full tw:flex tw:items-center tw:gap-2.5 tw:px-3 tw:py-2 tw:rounded-lg tw:text-[13.5px] tw:text-[#5E6D67] tw:hover:bg-[#FFFFFF]-[#F3EEE2] tw:bg-transparent tw:border-0 tw:cursor-pointer tw:text-left"
          >
            <i className="pi pi-sign-out tw:text-[15px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
