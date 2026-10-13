import { Navigate, useLocation } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="tw:h-screen tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-[#FAF7F1]">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="tw:h-screen tw:w-full tw:flex tw:items-center tw:justify-center tw:bg-[#FAF7F1] tw:px-6">
        <div className="rc-card tw:max-w-sm tw:w-full tw:p-8 tw:text-center">
          <div className="tw:w-12 tw:h-12 tw:rounded-full tw:bg-[#F3E7E1] tw:text-[#9C4E3A] tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-4">
            <i className="pi pi-lock tw:text-xl" />
          </div>
          <h3 className="font-display tw:text-lg tw:mb-2">
            Admin access required
          </h3>
          <p className="tw:text-sm tw:text-[#5E6D67] tw:mb-6">
            This account does not have admin privileges on Roshni Creations.
          </p>
          <button
            onClick={logout}
            className="tw:bg-[#1F4E47] tw:text-white tw:text-sm tw:px-4 tw:py-2 tw:rounded-md tw-[#E7E0CE]-0 tw:cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return children;
}
