// These mirror the actual Mongoose enums in the backend models —
// keep in sync with productModel.js / orderModel.js.

export const AVAILABILITY_OPTIONS = [
  { label: "In stock", value: "in-stock" },
  { label: "Made to order", value: "made-to-order" },
  { label: "Out of stock", value: "out-of-stock" },
];

export const BADGE_OPTIONS = [
  { label: "None", value: "" },
  { label: "NEW", value: "NEW" },
  { label: "BESTSELLER", value: "BESTSELLER" },
  { label: "HERITAGE", value: "HERITAGE" },
  { label: "TRENDING", value: "TRENDING" },
  { label: "SALE", value: "SALE" },
];

// Current backend enum only has these six. "Packed" and "Out for Delivery"
// are shown in the UI (per the product design) but will only persist once
// the backend enum + updateStatus endpoint are added — see README.md.
export const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const ORDER_STATUS_IN_BACKEND_ENUM = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const PAYMENT_STATUS_OPTIONS = ["Pending", "Paid", "Failed"];
export const PAYMENT_STATUS_IN_BACKEND_ENUM = ["Pending", "Paid", "Failed"];

export const ADDRESS_TYPES = ["Home", "Work", "Other"];
