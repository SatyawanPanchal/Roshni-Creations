/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";
import logo from "../../../assets/logo.webp";

import {
  getOrderByIdAdmin,
  getOrderFromAllOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
} from "../../api/order.api.js";
import { NotImplementedError } from "../../api/axiosClient.js";
import EmptyState from "../../components/common/EmptyState.jsx";
import NotImplementedNotice from "../../components/common/NotImplementedNotice.jsx";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../../components/common/StatusBadge.jsx";
import { formatCurrency, formatDate, fullName } from "../../utils/helpers.js";
import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../../utils/constants.js";
import { showSuccess, showError } from "../../utils/toast.js";

const FLOW = [
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [niError, setNiError] = useState(null);

  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");

  const [payModal, setPayModal] = useState(false);
  const [selectedPay, setSelectedPay] = useState("");

  const [invoiceModal, setInvoiceModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // Prefer the unscoped admin endpoint; fall back to finding it
      // inside the full admin order list if that route isn't deployed yet.
      let o;
      try {
        o = await getOrderByIdAdmin(id);
      } catch (err) {
        if (err instanceof NotImplementedError) {
          o = await getOrderFromAllOrders(id);
        } else {
          throw err;
        }
      }
      setOrder(o);
      if (o) {
        setSelectedStatus(o.orderStatus);
        setCourier(o.courier || "");
        setTracking(o.trackingNumber || "");
        setSelectedPay(o.paymentStatus);
      }
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const applyStatus = async () => {
    try {
      const updated = await updateOrderStatus(order._id, {
        orderStatus: selectedStatus,
        courier,
        trackingNumber: tracking,
      });
      setOrder((o) => ({
        ...o,
        orderStatus: updated?.orderStatus ?? selectedStatus,
        courier: updated?.courier ?? courier,
        trackingNumber: updated?.trackingNumber ?? tracking,
      }));
      setStatusModal(false);
      showSuccess("Order status updated successfully");
    } catch (err) {
      if (err instanceof NotImplementedError) {
        setNiError(err);
        setStatusModal(false);
      } else {
        showError(err.response?.data?.message || "Failed to update status");
      }
    }
  };

  const applyPayment = async () => {
    try {
      const updated = await updateOrderPaymentStatus(order._id, {
        paymentStatus: selectedPay,
      });
      setOrder((o) => ({
        ...o,
        paymentStatus: updated?.paymentStatus ?? selectedPay,
      }));
      setPayModal(false);
      showSuccess("Payment status updated successfully");
    } catch (err) {
      if (err instanceof NotImplementedError) {
        setNiError(err);
        setPayModal(false);
      } else {
        showError(
          err.response?.data?.message || "Failed to update payment status",
        );
      }
    }
  };

  const handleCancel = () => {
    confirmDialog({
      header: "Cancel order",
      message: `Cancel order ${order.customOrderId}? The customer will be notified and any payment will need to be refunded.`,
      acceptLabel: "Cancel order",
      acceptClassName: "p-button-[#9C4E3A]",
      accept: async () => {
        try {
          const updated = await cancelOrder(order._id);
          setOrder((o) => ({
            ...o,
            orderStatus: updated?.orderStatus ?? "Cancelled",
            paymentStatus: updated?.paymentStatus ?? o.paymentStatus,
          }));
          showSuccess("Order cancelled successfully");
        } catch (err) {
          if (err instanceof NotImplementedError) setNiError(err);
          else
            showError(err.response?.data?.message || "Failed to cancel order");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rc-card">
        <EmptyState
          icon="pi-box"
          title="Order not found"
          subtitle="This order may not exist."
          action={
            <Link to="/orders">
              <Button label="Back to orders" size="small" />
            </Link>
          }
        />
      </div>
    );
  }

  const cancelled = order.orderStatus === "Cancelled";
  const addr = order.addressId;

  return (
    <div>
      <Link
        to="/admin/orders"
        className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[12.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-3.5"
      >
        <i className="pi pi-arrow-left tw:text-xs" /> Back to orders
      </Link>

      <NotImplementedNotice error={niError} />

      <div className="tw:flex tw:items-start tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-5">
        <div>
          <div className="font-display tw:text-xl tw:sm:text-2xl mono">
            {order.customOrderId}
          </div>
          <div className="tw:text-[13px] tw:text-[#5E6D67] tw:mt-1 tw:flex tw:items-center tw:gap-2">
            Placed on {formatDate(order.createdAt)}{" "}
            <OrderStatusBadge status={order.orderStatus} />
          </div>
        </div>
        <div className="tw:flex tw:gap-2.5 tw:flex-wrap">
          <Button
            label="Invoice"
            icon="pi pi-file"
            outlined
            onClick={() => setInvoiceModal(true)}
          />
          {!cancelled && (
            <Button
              label="Update status"
              icon="pi pi-truck"
              outlined
              onClick={() => setStatusModal(true)}
            />
          )}
          {!cancelled && order.orderStatus !== "Delivered" && (
            <Button
              label="Cancel order"
              icon="pi pi-times"
              severity="danger"
              outlined
              onClick={handleCancel}
            />
          )}
        </div>
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-5">
        <div>
          <div className="rc-card tw:p-5 tw:mb-4">
            <div className="font-display tw:text-base tw:mb-3">Customer</div>
            <Kv label="Name" value={fullName(order.userId)} />
            <Kv label="Email" value={order.userId?.email || "—"} />
            <Kv label="Phone" value={order.userId?.phone || "—"} />
            {order.userId && (
              <Link
                to={`/admin/customers/${
                  typeof order.userId === "object"
                    ? order.userId._id
                    : order.userId
                }`}
                className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[#1F4E47] tw:text-[12.5px] tw:no-underline tw:mt-2"
              >
                View customer profile
                <i className="pi pi-arrow-right tw:text-[10px]" />
              </Link>
            )}
          </div>

          <div className="rc-card tw:p-5 tw:mb-4">
            <div className="font-display tw:text-base tw:mb-3">
              Shipping address
            </div>
            {addr ? (
              <div className="tw:text-[13px] tw:text-[#5E6D67] tw:leading-relaxed">
                {addr.firstName} {addr.lastName}
                <br />
                {addr.flat}, {addr.street}
                <br />
                {addr.city}, {addr.state} {addr.pincode}
                <br />
                {addr.landmark ? (
                  <>
                    {addr.landmark}
                    <br />
                  </>
                ) : null}
                {addr.country}
              </div>
            ) : (
              <div className="tw:text-[12.5px] tw:text-[#9AA39B]">
                No address on file
              </div>
            )}
          </div>

          <div className="rc-card tw:p-5">
            <div className="font-display tw:text-base tw:mb-3">Shipping</div>
            <Timeline current={order.orderStatus} />
            <Kv
              label="Courier partner"
              value={order.courier || "Not assigned"}
            />
            <Kv
              label="Tracking number"
              value={order.trackingNumber || "—"}
              mono
            />
          </div>
        </div>

        <div>
          <div className="rc-card tw:p-5 tw:mb-4">
            <div className="font-display tw:text-base tw:mb-3">
              Ordered products
            </div>
            {order.items.map((it, i) => (
              <div
                key={i}
                className="tw:flex tw:items-center tw:gap-3 tw:py-2.5 tw:border-b tw:border-[#E7E0CE] tw:last:border-0"
              >
                <div className="tw:w-9 tw:h-9 tw:rounded-md tw:bg-[#E9F1EC] tw:text-[#1F4E47] tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                  <i className="pi pi-image tw:text-xs" />
                </div>
                <div className="tw:flex-1 tw:min-w-0">
                  <div className="tw:text-[13px] tw:font-medium tw:truncate">
                    {it.name}
                  </div>
                  <div className="tw:text-[11.5px] tw:text-[#9AA39B]">
                    Qty {it.quantity} × {formatCurrency(it.price)}
                  </div>
                </div>
                <div className="mono tw:text-[13px]">
                  {formatCurrency(it.quantity * it.price)}
                </div>
              </div>
            ))}
            <PriceRow label="Subtotal" value={formatCurrency(order.subtotal)} />
            <PriceRow
              label="Discount"
              value={`−${formatCurrency(order.discount || 0)}`}
            />
            <PriceRow
              label="Shipping"
              value={order.shipping ? formatCurrency(order.shipping) : "Free"}
            />
            <PriceRow label="Tax" value={formatCurrency(order.tax || 0)} />
            <PriceRow
              label="Grand total"
              value={formatCurrency(order.totalAmount)}
              total
            />
          </div>

          <div className="rc-card tw:p-5">
            <div className="tw:flex tw:justify-between tw:items-center tw:mb-3">
              <div className="font-display tw:text-base">Payment</div>
              {!cancelled && (
                <Button
                  label="Update"
                  text
                  size="small"
                  onClick={() => setPayModal(true)}
                />
              )}
            </div>
            <Kv label="Method" value={order.paymentMethod} />
            <Kv
              label="Status"
              value={<PaymentStatusBadge status={order.paymentStatus} />}
            />
            <Kv
              label="Transaction ID"
              value={order.transactionId || "—"}
              mono
            />
            <Kv
              label="Payment date"
              value={
                order.paymentStatus === "Paid"
                  ? formatDate(order.updatedAt)
                  : "—"
              }
            />
          </div>
        </div>
      </div>

      {/* Update status dialog */}
      <Dialog
        header="Update order status"
        visible={statusModal}
        onHide={() => setStatusModal(false)}
        style={{ width: 420 }}
      >
        <div className="tw:flex tw:flex-col tw:gap-2 tw:mb-4">
          {ORDER_STATUS_OPTIONS.map((s) => (
            <label
              key={s}
              className={
                "tw:flex tw:items-center tw:gap-2.5 tw:border tw:rounded-lg tw:px-3 tw:py-2.5 tw:text-[13px] tw:cursor-pointer " +
                (selectedStatus === s
                  ? "tw:border-[#1F4E47] tw:bg-[#E9F1EC]"
                  : "tw:border-[#E7E0CE]")
              }
            >
              <input
                type="radio"
                name="statusOpt"
                checked={selectedStatus === s}
                onChange={() => setSelectedStatus(s)}
              />
              {s}
            </label>
          ))}
        </div>
        {selectedStatus === "Shipped" && (
          <div className="tw:mb-4">
            <div className="tw:mb-3">
              <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
                Shipping partner
              </label>
              <InputText
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="tw:w-full"
                placeholder="e.g. Delhivery"
              />
            </div>
            <div>
              <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
                Tracking number
              </label>
              <InputText
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="tw:w-full"
                placeholder="e.g. DLV839201234"
              />
            </div>
          </div>
        )}
        <Button
          label="Apply change"
          className="tw:w-full tw:justify-center"
          onClick={applyStatus}
        />
      </Dialog>

      {/* Update payment dialog */}
      <Dialog
        header="Update payment status"
        visible={payModal}
        onHide={() => setPayModal(false)}
        style={{ width: 380 }}
      >
        <div className="tw:flex tw:flex-col tw:gap-2 tw:mb-4">
          {PAYMENT_STATUS_OPTIONS.map((s) => (
            <label
              key={s}
              className={
                "tw:flex tw:items-center tw:gap-2.5 tw:border tw:rounded-lg tw:px-3 tw:py-2.5 tw:text-[13px] tw:cursor-pointer " +
                (selectedPay === s
                  ? "tw:border-[#1F4E47] tw:bg-[#E9F1EC]"
                  : "tw:border-[#E7E0CE]")
              }
            >
              <input
                type="radio"
                name="payOpt"
                checked={selectedPay === s}
                onChange={() => setSelectedPay(s)}
              />
              {s}
            </label>
          ))}
        </div>
        <Button
          label="Update payment status"
          className="tw:w-full tw:justify-center"
          onClick={applyPayment}
        />
      </Dialog>

      {/* Invoice dialog */}
      <Dialog
        header="Invoice"
        visible={invoiceModal}
        onHide={() => setInvoiceModal(false)}
        style={{ width: 640 }}
      >
        <div className="tw:flex tw:justify-between tw:items-start tw:mb-5">
          <div className="tw:flex tw:items-center tw:gap-2.5">
            <div className="tw:w-9 tw:h-9 tw:rounded-full tw:border tw:border-[#AD8A3F] tw:text-[#AD8A3F] tw:flex tw:items-center tw:justify-center font-display">
              <img src={logo} alt="Logo" />
            </div>
            <div>
              <div className="font-display tw:text-[15px]">
                Roshni Creations
              </div>
              <div className="tw:text-[10.5px] tw:text-[#9AA39B]">
                Handcrafted jewellery, made in India
              </div>
            </div>
          </div>
          <div className="tw:text-right tw:text-[12px] tw:text-[#5E6D67]">
            <div className="font-display tw:text-[15px] tw:text-[#1C2B28]">
              Invoice
            </div>
            Order {order.customOrderId}
            <br />
            {formatDate(order.createdAt)}
          </div>
        </div>
        {addr && (
          <div className="tw:text-[12.5px] tw:text-[#5E6D67] tw:mb-4 tw:leading-relaxed">
            <div className="tw:text-[11px] tw:text-[#9AA39B] tw:mb-1">
              SHIPPING ADDRESS
            </div>
            {addr.firstName} {addr.lastName}
            <br />
            {addr.flat}, {addr.street}
            <br />
            {addr.city}, {addr.state} {addr.pincode}
            <br />
            {addr.country}
          </div>
        )}
        <table className="tw:w-full tw:text-[13px] tw:border-collapse tw:mb-4">
          <thead>
            <tr className="tw:text-[11px] tw:text-[#9AA39B] tw:border-b tw:border-[#E7E0CE]">
              <th className="tw:text-left tw:font-medium tw:py-2">Product</th>
              <th className="tw:text-left tw:font-medium tw:py-2">Qty</th>
              <th className="tw:text-right tw:font-medium tw:py-2">
                Unit price
              </th>
              <th className="tw:text-right tw:font-medium tw:py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, i) => (
              <tr key={i} className="tw:border-b tw:border-[#E7E0CE]">
                <td className="tw:py-2">{it.name}</td>
                <td className="tw:py-2">{it.quantity}</td>
                <td className="tw:py-2 tw:text-right mono">
                  {formatCurrency(it.price)}
                </td>
                <td className="tw:py-2 tw:text-right mono">
                  {formatCurrency(it.quantity * it.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tw:flex tw:justify-end tw:mb-4">
          <div className="tw:w-56">
            <PriceRow label="Subtotal" value={formatCurrency(order.subtotal)} />
            <PriceRow
              label="Discount"
              value={`−${formatCurrency(order.discount || 0)}`}
            />
            <PriceRow
              label="Shipping"
              value={order.shipping ? formatCurrency(order.shipping) : "Free"}
            />
            <PriceRow label="Tax" value={formatCurrency(order.tax || 0)} />
            <PriceRow
              label="Grand total"
              value={formatCurrency(order.totalAmount)}
              total
            />
          </div>
        </div>
        <div className="tw:flex tw:justify-end tw:gap-2.5">
          <Button
            label="Print"
            icon="pi pi-print"
            outlined
            onClick={() => window.print()}
          />
        </div>
      </Dialog>
    </div>
  );
}

function Kv({ label, value, mono }) {
  return (
    <div className="tw:flex tw:justify-between tw:text-[13px] tw:py-1.5 tw:border-b tw:border-[#E7E0CE] tw:last:border-0">
      <span className="tw:text-[#9AA39B]">{label}</span>
      <span className={mono ? "mono" : ""}>{value}</span>
    </div>
  );
}

function PriceRow({ label, value, total }) {
  return (
    <div
      className={
        "tw:flex tw:justify-between tw:text-[13px] tw:py-1.5 " +
        (total
          ? "tw:font-semibold tw:text-[15px] tw:border-t tw:border-[#E7E0CE] tw:mt-1.5 tw:pt-3"
          : "tw:text-[#5E6D67]")
      }
    >
      <span>{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}

function Timeline({ current }) {
  if (current === "Cancelled") {
    return (
      <div className="tw:text-[13px] tw:text-[#9C4E3A] tw:mb-4 tw:flex tw:items-center tw:gap-2">
        <i className="pi pi-times-circle" /> Order cancelled
      </div>
    );
  }
  const idx = current === "Pending" ? -1 : FLOW.indexOf(current);
  return (
    <div className="tw:flex tw:flex-col tw:mb-4">
      {FLOW.map((s, i) => (
        <div key={s} className="tw:flex tw:gap-3">
          <div className="tw:flex tw:flex-col tw:items-center">
            <div
              className={
                "tw:w-4 tw:h-4 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:flex-shrink-0 " +
                (i <= idx
                  ? "tw:bg-[#1F4E47]"
                  : "tw:bg-su[#FFFFFF]rface tw:border tw:border-[#E7E0CE]")
              }
            >
              {i <= idx && (
                <i
                  className="pi pi-check tw:text-white"
                  style={{ fontSize: 8 }}
                />
              )}
            </div>
            {i < FLOW.length - 1 && (
              <div
                className={
                  "tw:w-0.5 tw:flex-1 " +
                  (i < idx ? "tw:bg-[#1F4E47]" : "tw:bg-[#E7E0CE]")
                }
                style={{ minHeight: 18 }}
              />
            )}
          </div>
          <div
            className={
              "tw:text-[12.5px] tw:pb-4 " +
              (i <= idx ? "" : "tw:text-[#9AA39B]")
            }
          >
            {s}
          </div>
        </div>
      ))}
    </div>
  );
}
