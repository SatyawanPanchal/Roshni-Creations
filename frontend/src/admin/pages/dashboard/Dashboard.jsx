/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

import { getAllProducts } from "../../api/product.api.js";
import { getAllOrders } from "../../api/order.api.js";
import ErrorState from "../../components/common/ErrorState.jsx";
import Thumb from "../../components/common/Thumb.jsx";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../../components/common/StatusBadge.jsx";
import { formatCurrency, formatDate, fullName } from "../../utils/helpers.js";
import { ORDER_STATUS_IN_BACKEND_ENUM } from "../../utils/constants.js";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  console.log("products in dashboard",products)
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, o] = await Promise.all([getAllProducts(), getAllOrders()]);
      setProducts(p);
      setOrders(o);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const kpis = useMemo(() => {
    const productList = Array.isArray(products) ? products : [];
    const orderList = Array.isArray(orders) ? orders : [];

    const revenue = orderList
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      revenue,
      totalOrders: orderList.length,
      pendingOrders: orderList.filter((o) => o.orderStatus === "Pending")
        .length,
      totalProducts: productList.length,
      lowStock: productList.filter(
        (p) => p.availability === "in-stock" && p.stockLeft <= 3,
      ).length,
    };
  }, [products, orders]);

  const statusCounts = useMemo(() => {
    if (!orders) return [];
    const counts = {};
    ORDER_STATUS_IN_BACKEND_ENUM.forEach((s) => (counts[s] = 0));
    orders.forEach(
      (o) => (counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1),
    );
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const chartData = useMemo(() => {
    if (!orders) return [];
    // group by date (createdAt) — simple day bucket over the last 7 entries available
    const byDate = {};
    orders.forEach((o) => {
      const d = new Date(o.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      byDate[d] = (byDate[d] || 0) + (o.totalAmount || 0);
    });
    return Object.entries(byDate).map(([date, total]) => ({ date, total }));
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    if (!products) return [];
    return products
      .filter((p) => p.availability === "in-stock" && p.stockLeft <= 3)
      .slice(0, 5);
  }, [products]);

  const recentOrders = useMemo(
    () => (orders ? orders.slice(0, 5) : []),
    [orders],
  );

  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rc-card">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div>
      <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:lg:grid-cols-5 tw:gap-3.5 tw:mb-5">
        <Kpi
          icon="pi-wallet"
          value={formatCurrency(kpis.revenue)}
          label="Total revenue"
        />
        <Kpi icon="pi-box" value={kpis.totalOrders} label="Total orders" />
        <Kpi
          icon="pi-clock"
          value={kpis.pendingOrders}
          label="Pending orders"
        />
        <Kpi icon="pi-shopping-bag" value={kpis.totalProducts} label="Total products" />
        <Kpi
          icon="pi-exclamation-circle"
          value={kpis.lowStock}
          label="Low stock items"
          warn={kpis.lowStock > 0}
        />
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[1.6fr_1fr] tw:gap-4 tw:mb-4">
        <div className="rc-card tw:p-5">
          <div className="font-display tw:text-base tw:mb-1">
            Sales overview
          </div>
          <div className="tw:text-[12px] tw:text-[#9AA39B] tw:mb-4">
            Revenue per order date
          </div>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--color-[#9AA39B])" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="total" fill="[#1F4E47]" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="tw:text-[12.5px] tw:text-[#9AA39B] tw:py-10 tw:text-center">
              No orders yet
            </div>
          )}
        </div>

        <div className="rc-card tw:p-5">
          <div className="font-display tw:text-base tw:mb-1">Order status</div>
          <div className="tw:text-[12px] tw:text-[#9AA39B] tw:mb-4">
            Distribution across all orders
          </div>
          <div className="tw:flex tw:flex-col tw:gap-3">
            {statusCounts.map(({ name, value }) => {
              const max = Math.max(...statusCounts.map((s) => s.value), 1);
              return (
                <div
                  key={name}
                  className="tw:flex tw:items-center tw:gap-2.5 tw:text-[12.5px]"
                >
                  <div className="tw:w-24 tw:text-[#5E6D67] tw:flex-shrink-0">
                    {name}
                  </div>
                  <div className="tw:flex-1 tw:h-1.5 tw:rounded tw:bg-[#FFFFFF]-muted tw:overflow-hidden">
                    <div
                      className="tw:h-full tw:rounded tw:bg-[#1F4E47]"
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                  <div className="tw:w-5 tw:text-right tw:text-[#9AA39B]">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[1.6fr_1fr] tw:gap-4 tw:mb-4">
        <div className="rc-card">
          <div className="tw:p-5 tw:pb-3">
            <div className="font-display tw:text-base">Recent orders</div>
            <div className="tw:text-[12px] tw:text-[#9AA39B]">
              Latest activity across your store
            </div>
          </div>
          <div className="tw:overflow-x-auto">
            <table className="tw:w-full tw:text-[13px] tw:border-collapse">
              <thead>
                <tr className="tw:text-[11px] tw:text-[#9AA39B] tw:border-b tw:border-[#E7E0CE]">
                  <th className="tw:text-left tw:font-medium tw:px-5 tw:pb-2.5">
                    Order
                  </th>
                  <th className="tw:text-left tw:font-medium tw:px-3 tw:pb-2.5">
                    Customer
                  </th>
                  <th className="tw:text-left tw:font-medium tw:px-3 tw:pb-2.5">
                    Amount
                  </th>
                  <th className="tw:text-left tw:font-medium tw:px-3 tw:pb-2.5">
                    Status
                  </th>
                  <th className="tw:px-3 tw:pb-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr
                    key={o._id}
                    className="tw:border-b tw:border-[#E7E0CE] tw:last:border-0"
                  >
                    <td className="tw:px-5 tw:py-2.5 mono">
                      {o.customOrderId}
                    </td>
                    <td className="tw:px-3 tw:py-2.5">{fullName(o.userId)}</td>
                    <td className="tw:px-3 tw:py-2.5 mono">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="tw:px-3 tw:py-2.5">
                      <OrderStatusBadge status={o.orderStatus} />
                    </td>
                    <td className="tw:px-3 tw:py-2.5 tw:text-right">
                      <Link
                        to={`/admin/orders/${o._id}`}
                        className="tw:text[#1F4E47]teal tw:text-xs tw:no-underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {!recentOrders.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="tw:text-center tw:text-[#9AA39B] tw:py-8 tw:text-[12.5px]"
                    >
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="rc-card tw:p-5">
          <div className="font-display tw:text-base tw:mb-1">Low stock</div>
          <div className="tw:text-[12px] tw:text-[#9AA39B] tw:mb-3">
            Products that need restocking
          </div>
          {lowStockProducts.length ? (
            lowStockProducts.map((p) => (
              <div
                key={p._id}
                className="tw:flex tw:items-center tw:gap-2.5 tw:py-2.5 tw:border-b tw:border-[#E7E0CE] tw:last:border-0"
              >
                <Thumb src={p.image} gold size={36} />
                <div className="tw:flex-1 tw:min-w-0">
                  <div className="tw:text-[12.5px] tw:font-medium tw:truncate">
                    {p.name}
                  </div>
                  <div className="tw:text-[11px] tw:text-[#9AA39B] tw:truncate">
                    {p.category?.title}
                  </div>
                </div>
                <div className="tw:text-[12.5px] tw:text-[#9C4E3A] mono">
                  {p.stockLeft} left
                </div>
              </div>
            ))
          ) : (
            <div className="tw:text-[12.5px] tw:text-[#9AA39B]">
              All products are well stocked.
            </div>
          )}
        </div> */}
      </div>

      <div className="rc-card tw:p-5">
        <div className="font-display tw:text-base tw:mb-3">Quick actions</div>
        <div className="tw:flex tw:flex-wrap tw:gap-2.5">
          <QuickAction
            to="/admin/products/add"
            icon="pi-plus"
            label="Add product"
          />
          <QuickAction
            to="/admin/categories/add"
            icon="pi-plus"
            label="Add category"
          />
          <QuickAction
            to="/admin/collections/add"
            icon="pi-plus"
            label="Add collection"
          />
          <QuickAction to="/admin/orders" icon="pi-box" label="View orders" />
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, value, label, warn }) {
  return (
    <div className="rc-card tw:p-4">
      <div
        className={
          "tw:w-8 tw:h-8 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:mb-2.5 " +
          (warn
            ? "tw:bg-[#F3E7E1] tw:text-[#9C4E3A]"
            : "tw:bg[#1F4E47]teal-[#5E6D67] tw:text[#1F4E47]teal")
        }
      >
        <i className={`pi ${icon} tw:text-sm`} />
      </div>
      <div className="font-display tw:text-lg">{value}</div>
      <div className="tw:text-[12px] tw:text-[#5E6D67]">{label}</div>
    </div>
  );
}

function QuickAction({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="tw:flex tw:items-center tw:gap-2 tw:text-[13px] tw:px-3.5 tw:py-2 tw:rounded-md tw:border tw:border-[#E7E0CE] tw:bg-[#FFFFFF] tw:no-underline tw:text-[#1C2B28] tw:hover:border-[#AD8A3F]"
    >
      <i className={`pi ${icon} tw:text-xs`} /> {label}
    </Link>
  );
}
