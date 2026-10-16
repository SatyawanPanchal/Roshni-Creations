/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import {
  getAllCustomers,
  toggleCustomerStatus,
} from "../../api/customer.api.js";
import { NotImplementedError } from "../../api/axiosClient.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import NotImplementedNotice from "../../components/common/NotImplementedNotice.jsx";
import { ActiveBadge } from "../../components/common/StatusBadge.jsx";
import {
  formatCurrency,
  formatDate,
  fullName,
  initials,
} from "../../utils/helpers.js";
import { showSuccess, showError } from "../../utils/toast.js";

const PAGE_SIZE = 8;

export default function CustomerList() {
  const [customers, setCustomers] = useState(null);
  const [niError, setNiError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [first, setFirst] = useState(0);

  const load = async () => {
    setNiError(null);
    try {
      setCustomers(await getAllCustomers());
    } catch (err) {
      if (err instanceof NotImplementedError) {
        setNiError(err);
        setCustomers([]);
      } else {
        showError(err.response?.data?.message || "Failed to load customers");
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    return customers.filter((c) => {
      const name = fullName(c).toLowerCase();
      if (
        search &&
        !name.includes(search.toLowerCase()) &&
        !c.email?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (statusFilter === "active" && !c.isActive) return false;
      if (statusFilter === "inactive" && c.isActive) return false;
      return true;
    });
  }, [customers, search, statusFilter]);

  const paged = filtered.slice(first, first + PAGE_SIZE);

  const handleToggle = (c) => {
    confirmDialog({
      header: c.isActive ? "Deactivate customer" : "Activate customer",
      message: `Are you sure you want to ${c.isActive ? "deactivate" : "activate"} ${fullName(c)}?`,
      acceptClassName: c.isActive ? "p-button-[#9C4E3A]" : undefined,
      accept: async () => {
        try {
          await toggleCustomerStatus(c._id, !c.isActive);
          showSuccess(
            `Customer ${c.isActive ? "deactivated" : "activated"} successfully`,
          );
          load();
        } catch (err) {
          if (err instanceof NotImplementedError) setNiError(err);
          else
            showError(
              err.response?.data?.message || "Failed to update customer",
            );
        }
      },
    });
  };

  if (!customers) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div className="tw:min-w-0 tw:max-w-full">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} registered customers`}
      />

      <NotImplementedNotice error={niError} />

      {niError ? (
        <div className="rc-card">
          <EmptyState
            icon="pi-users"
            title="Customer management isn't wired up yet"
            subtitle="Once the backend endpoint above is added, this page will list every customer automatically — no frontend changes needed."
          />
        </div>
      ) : (
        <div className="rc-card">
          <div className="tw:p-4 tw:flex tw:flex-col tw:sm:flex-row tw:gap-2.5 tw:border-b tw:border-[#E7E0CE]">
            <div className="tw:relative tw:w-full tw:sm:w-56">
              <i className="pi pi-search tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-500" />
              <InputText
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFirst(0);
                }}
                placeholder="Search name or email…"
                className="tw:w-full tw:pr-10"
              />
            </div>
            <Dropdown
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.value);
                setFirst(0);
              }}
              options={[
                { label: "All status", value: null },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              className="tw:w-full tw:sm:w-40"
              placeholder="Status"
            />
          </div>

          {filtered.length ? (
            <>
              <div className="tw:overflow-x-auto">
                <table className="tw:w-full tw:text-[13px] tw:border-collapse">
                  <thead>
                    <tr className="tw:text-[11px] tw:text-[#9AA39B] tw:border-b tw:border-[#E7E0CE]">
                      <th className="tw:text-left tw:font-medium tw:px-4 tw:py-2.5">
                        Customer
                      </th>
                      <th className="tw:text-left tw:font-medium tw:px-3 tw:py-2.5 tw:hidden tw:md:table-cell">
                        Phone
                      </th>
                      <th className="tw:text-left tw:font-medium tw:px-3 tw:py-2.5 tw:hidden tw:lg:table-cell">
                        Registered
                      </th>
                      <th className="tw:text-left tw:font-medium tw:px-3 tw:py-2.5">
                        Status
                      </th>
                      <th className="tw:px-3 tw:py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((c) => (
                      <tr
                        key={c._id}
                        className="tw:border-b tw:border-[#E7E0CE] tw:last:border-0"
                      >
                        <td className="tw:px-4 tw:py-2.5">
                          <div className="tw:flex tw:items-center tw:gap-2.5">
                            <div className="tw:w-8 tw:h-8 tw:shrink-0 tw:rounded-full tw:bg-[#E9F1EC] tw:text-[#1F4E47] tw:flex tw:items-center tw:justify-center tw:text-[11px] tw:font-semibold">
                              {initials(c.firstName, c.lastName)}
                            </div>
                            <div className="tw:min-w-0">
                              <div className="tw:font-medium tw:truncate">
                                {fullName(c)}
                              </div>
                              <div className="tw:text-[11px] tw:text-[#9AA39B] tw:truncate">
                                {c.email}
                              </div>
                              {/* phone shows here only on small screens */}
                              <div className="tw:text-[11px] tw:text-[#9AA39B] tw:md:hidden">
                                {c.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="tw:px-3 tw:py-2.5 tw:hidden tw:md:table-cell">
                          {c.phone}
                        </td>
                        <td className="tw:px-3 tw:py-2.5 tw:hidden tw:lg:table-cell">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="tw:px-3 tw:py-2.5">
                          <ActiveBadge active={c.isActive} />
                        </td>
                        <td className="tw:px-3 tw:py-2.5">
                          <div className="tw:flex tw:gap-1 tw:justify-end">
                            <Link to={`/admin/customers/${c._id}`}>
                              <Button icon="pi pi-eye" text rounded />
                            </Link>
                            <Button
                              icon={c.isActive ? "pi pi-times" : "pi pi-check"}
                              text
                              rounded
                              onClick={() => handleToggle(c)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              icon="pi-users"
              title="No customers found"
              subtitle="Try a different search or filter."
            />
          )}
        </div>
      )}
    </div>
  );
}
