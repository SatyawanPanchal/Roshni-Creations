const ORDER_STATUS_MAP = {
  Pending: "muted",
  Confirmed: "gold",
  Processing: "gold",
  Packed: "gold",
  Shipped: "teal",
  "Out for Delivery": "gold",
  Delivered: "teal",
  Cancelled: "danger",
};
const PAYMENT_STATUS_MAP = { Paid: "teal", Pending: "gold", Failed: "danger" };

export function OrderStatusBadge({ status }) {
  const tone = ORDER_STATUS_MAP[status] || "muted";
  return (
    <span className={`rc-badge rc-badge-${tone}`}>
      <span className="dot" />
      {status}
    </span>
  );
}

export function PaymentStatusBadge({ status }) {
  const tone = PAYMENT_STATUS_MAP[status] || "muted";
  return (
    <span className={`rc-badge rc-badge-${tone}`}>
      <span className="dot" />
      {status}
    </span>
  );
}

export function ActiveBadge({ active }) {
  return (
    <span className={`rc-badge ${active ? "rc-badge-teal" : "rc-badge-muted"}`}>
      <span className="dot" />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function AvailabilityBadge({ availability }) {
  const map = {
    "in-stock": ["In stock", "teal"],
    "made-to-order": ["Made to order", "gold"],
    "out-of-stock": ["Out of stock", "danger"],
  };
  const [label, tone] = map[availability] || ["—", "muted"];
  return (
    <span className={`rc-badge rc-badge-${tone}`}>
      <span className="dot" />
      {label}
    </span>
  );
}
