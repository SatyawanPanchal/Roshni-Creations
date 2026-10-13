/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import { getCustomerById, toggleCustomerStatus } from "../../api/customer.api.js";
import { NotImplementedError } from "../../api/axiosClient.js";
import EmptyState from "../../components/common/EmptyState.jsx";
import NotImplementedNotice from "../../components/common/NotImplementedNotice.jsx";
import { ActiveBadge, OrderStatusBadge, PaymentStatusBadge } from "../../components/common/StatusBadge.jsx";
import { formatCurrency, formatDate, fullName } from "../../utils/helpers.js";
import { showSuccess, showError } from "../../utils/toast.js";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [niError, setNiError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getCustomerById(id)
      .then(setCustomer)
      .catch((err) => {
        if (err instanceof NotImplementedError) setNiError(err);
        else showError(err.response?.data?.message || "Failed to load customer");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleToggle = () => {
    confirmDialog({
      header: customer.isActive ? "Deactivate customer" : "Activate customer",
      message: `Are you sure you want to ${customer.isActive ? "deactivate" : "activate"} ${fullName(customer)}?`,
      acceptClassName: customer.isActive ? "p-button-[#9C4E3A]" : undefined,
      accept: async () => {
        try {
          await toggleCustomerStatus(customer._id, !customer.isActive);
          showSuccess(`Customer ${customer.isActive ? "deactivated" : "activated"} successfully`);
          load();
        } catch (err) {
          if (err instanceof NotImplementedError) setNiError(err);
          else showError(err.response?.data?.message || "Failed to update customer");
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

  if (niError && !customer) {
    return (
      <div>
        <Link to="/admin/admin/customers" className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[12.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-3.5">
          <i className="pi pi-arrow-left tw:text-xs" /> Back to customers
        </Link>
        <NotImplementedNotice error={niError} />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rc-card">
        <EmptyState icon="pi-users" title="Customer not found" subtitle="This customer may not exist." action={<Link to="/admin/customers"><Button label="Back to customers" size="small" /></Link>} />
      </div>
    );
  }

  const orders = customer.orders || [];
  const totalSpent = orders.filter((o) => o.paymentStatus === "Paid").reduce((s, o) => s + o.totalAmount, 0);
  const avg = orders.length ? Math.round(totalSpent / orders.length) : 0;

  return (
    <div>
      <Link to="/admin/customers" className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[12.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-3.5">
        <i className="pi pi-arrow-left tw:text-xs" /> Back to customers
      </Link>

      <div className="tw:flex tw:items-start tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-5">
        <div>
          <div className="font-display tw:text-xl tw:sm:text-2xl">{fullName(customer)}</div>
          <div className="tw:text-[13px] tw:text-[#5E6D67] tw:mt-1">Customer since {formatDate(customer.createdAt)}</div>
        </div>
        <Button label={customer.isActive ? "Deactivate" : "Activate"} icon={customer.isActive ? "pi pi-times" : "pi pi-check"} outlined onClick={handleToggle} />
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-5">
        <div>
          <div className="rc-card tw:p-5 tw:mb-4">
            <div className="font-display tw:text-base tw:mb-3">Customer information</div>
            <Kv label="Email" value={<>{customer.email} {customer.isEmailVerified ? <span className="rc-badge rc-badge-teal tw:ml-1.5"><span className="dot" />Verified</span> : <span className="rc-badge rc-badge-[#F3EEE2] tw:ml-1.5"><span className="dot" />Unverified</span>}</>} />
            <Kv label="Phone" value={customer.phone} />
            <Kv label="Account status" value={<ActiveBadge active={customer.isActive} />} />
            <Kv label="Last login" value={customer.lastLoginAt ? formatDate(customer.lastLoginAt) : "—"} />
          </div>
          <div className="rc-card tw:p-5">
            <div className="font-display tw:text-base tw:mb-3">Saved addresses</div>
            {(customer.addresses || []).length ? (
              customer.addresses.map((a) => (
                <div key={a._id} className="tw:text-[12.5px] tw:text-[#5E6D67] tw:leading-relaxed tw:mb-3">
                  <span className="tw:border tw:border-[#AD8A3F] tw:text-[#AD8A3F] tw:text-[10.5px] tw:px-2 tw:py-0.5 tw:rounded tw:inline-block tw:mb-1.5">{a.addressType}</span><br />
                  {a.firstName} {a.lastName}<br />
                  {a.flat}, {a.street}<br />
                  {a.city}, {a.state} {a.pincode}<br />
                  {a.country}
                </div>
              ))
            ) : (
              <div className="tw:text-[12.5px] tw:text-[#9AA39B]">No saved addresses</div>
            )}
          </div>
        </div>

        <div>
          <div className="rc-card tw:p-5 tw:mb-4">
            <div className="tw:grid tw:grid-cols-2 tw:gap-4">
              <SummaryStat label="Total orders" value={orders.length} />
              <SummaryStat label="Total spent" value={formatCurrency(totalSpent)} />
              <SummaryStat label="Last order" value={orders[0] ? formatDate(orders[0].createdAt) : "—"} />
              <SummaryStat label="Avg. order value" value={formatCurrency(avg)} />
            </div>
          </div>
          <div className="rc-card">
            <div className="tw:p-5 tw:pb-3">
              <div className="font-display tw:text-base">Order history</div>
            </div>
            {orders.length ? (
              <div className="tw:overflow-x-auto">
                <table className="tw:w-full tw:text-[13px] tw:border-collapse">
                  <thead>
                    <tr className="tw:text-[11px] tw:text-[#9AA39B] tw:border-b tw:border-[#E7E0CE]">
                      <th className="tw:text-left tw:font-medium tw:px-5 tw:pb-2.5">Order</th>
                      <th className="tw:text-left tw:font-medium tw:px-3 tw:pb-2.5">Amount</th>
                      <th className="tw:text-left tw:font-medium tw:px-3 tw:pb-2.5">Payment</th>
                      <th className="tw:text-left tw:font-medium tw:px-3 tw:pb-2.5">Status</th>
                      <th className="tw:px-3 tw:pb-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="tw:border-b tw:border-[#E7E0CE] tw:last:border-0">
                        <td className="tw:px-5 tw:py-2.5 mono">{o.customOrderId}</td>
                        <td className="tw:px-3 tw:py-2.5 mono">{formatCurrency(o.totalAmount)}</td>
                        <td className="tw:px-3 tw:py-2.5"><PaymentStatusBadge status={o.paymentStatus} /></td>
                        <td className="tw:px-3 tw:py-2.5"><OrderStatusBadge status={o.orderStatus} /></td>
                        <td className="tw:px-3 tw:py-2.5 tw:text-right">
                          <Link to={`/orders/${o._id}`} className="tw:text-[#1F4E47] tw:text-xs tw:no-underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon="pi-box" title="No orders yet" subtitle="This customer has not placed an order." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kv({ label, value }) {
  return (
    <div className="tw:flex tw:justify-between tw:text-[13px] tw:py-1.5 tw:border-b tw:border-[#E7E0CE] tw:last:border-0">
      <span className="tw:text-[#9AA39B]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div>
      <div className="font-display tw:text-lg">{value}</div>
      <div className="tw:text-[11.5px] tw:text-[#9AA39B]">{label}</div>
    </div>
  );
}
