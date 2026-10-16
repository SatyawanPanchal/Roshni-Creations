/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { ProgressSpinner } from "primereact/progressspinner";

import { getAllOrders } from "../../api/order.api.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../../components/common/StatusBadge.jsx";
import { formatCurrency, formatDate, fullName } from "../../utils/helpers.js";
import {
  ORDER_STATUS_IN_BACKEND_ENUM,
  PAYMENT_STATUS_OPTIONS,
} from "../../utils/constants.js";

const PAGE_SIZE = 8;

export default function OrderList() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [payFilter, setPayFilter] = useState(null);
  const [first, setFirst] = useState(0);

  const load = async () => {
    setError(null);
    try {
      setOrders(await getAllOrders());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      const customerName = fullName(o.userId).toLowerCase();
      if (
        search &&
        !o.customOrderId.toLowerCase().includes(search.toLowerCase()) &&
        !customerName.includes(search.toLowerCase())
      )
        return false;
      if (statusFilter && o.orderStatus !== statusFilter) return false;
      if (payFilter && o.paymentStatus !== payFilter) return false;
      return true;
    });
  }, [orders, search, statusFilter, payFilter]);

  const paged = filtered.slice(first, first + PAGE_SIZE);

  if (error) {
    return (
      <div className="rc-card">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} orders total`} />

      <div className="rc-card">
        <div className="tw:p-4 tw:flex tw:flex-wrap tw:gap-2.5 tw:border-b tw:border-[#E7E0CE]">
          <div className="tw:relative tw:w-56">
            <i className="pi pi-search tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-500" />
            <InputText
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFirst(0);
              }}
              placeholder="    Search order ID or customer…"
              className="tw:w-full tw:pl-10"
            />
          </div>
          <Dropdown
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.value);
              setFirst(0);
            }}
            options={[
              
              ...ORDER_STATUS_IN_BACKEND_ENUM.map((s) => ({
                label: s,
                value: s,
              })),
            ]}
            className="tw:w-44"
            placeholder="Order Status"
          />
          <Dropdown
            value={payFilter}
            onChange={(e) => {
              setPayFilter(e.value);
              setFirst(0);
            }}
            options={[
              
              ...PAYMENT_STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
            ]}
            className="tw:w-44"
            placeholder="Payment Status"
          />

          <Button
              label="Clear all"
              icon="pi pi-filter-slash"
              text
              onClick={() => {
                setSearch("");
                setStatusFilter(null)
                setPayFilter(null)
              }}
            />
        </div>

        {filtered.length ? (
          <>
            <DataTable value={paged} responsiveLayout="scroll" stripedRows>
              <Column
                header="Order"
                body={(o) => (
                  <span className="mono tw:font-medium">{o.customOrderId}</span>
                )}
              />
              <Column header="Customer" body={(o) => fullName(o.userId)} />
              <Column header="Date" body={(o) => formatDate(o.createdAt)} />
              <Column
                header="Items"
                body={(o) => o.items.reduce((s, i) => s + i.quantity, 0)}
              />
              <Column
                header="Amount"
                body={(o) => (
                  <span className="mono">{formatCurrency(o.totalAmount)}</span>
                )}
              />
              <Column
                header="Payment"
                body={(o) => <PaymentStatusBadge status={o.paymentStatus} />}
              />
              <Column
                header="Status"
                body={(o) => <OrderStatusBadge status={o.orderStatus} />}
              />
              <Column
                header=""
                body={(o) => (
                  <Link
                    to={`/admin/orders/${o._id}`}
                    className="tw:text-[#1F4E47] tw:text-xs tw:no-underline"
                  >
                    <Button icon="pi pi-eye" text rounded />
                  </Link>
                )}
              />
            </DataTable>
            <div className="tw:p-3 tw:border-t tw:border-[#E7E0CE]">
              <Paginator
                first={first}
                rows={PAGE_SIZE}
                totalRecords={filtered.length}
                onPageChange={(e) => setFirst(e.first)}
              />
            </div>
          </>
        ) : (
          <EmptyState
            icon="pi-box"
            title="No orders yet"
            subtitle="Orders placed by customers will appear here."
          />
        )}
      </div>
    </div>
  );
}
