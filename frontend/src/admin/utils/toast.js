// Tiny singleton so any file can fire a toast without prop-drilling a ref.
let toastRef = null;

export const registerToast = (ref) => {
  toastRef = ref;
};

export const showToast = ({ severity = "success", summary, detail, life = 3500 }) => {
  if (toastRef) toastRef.show({ severity, summary, detail, life });
};

export const showSuccess = (detail) => showToast({ severity: "success", summary: "Success", detail });
export const showError = (detail) => showToast({ severity: "error", summary: "Error", detail, life: 5000 });
export const showInfo = (detail) => showToast({ severity: "info", summary: "Info", detail });

// Special-cased toast for hitting a stub / not-yet-implemented backend route.
export const showNotImplemented = (err) => {
  showToast({
    severity: "warn",
    summary: "Backend endpoint needed",
    detail: `${err.method} ${err.path} isn't implemented yet on the backend. See README.md for the contract.`,
    life: 7000,
  });
};
