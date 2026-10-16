/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import {
  getAllCategoriesAdmin,
  updateCategory,
  deleteCategory,
} from "../../api/category.api.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Thumb from "../../components/common/Thumb.jsx";
import { ActiveBadge } from "../../components/common/StatusBadge.jsx";
import { formatDate } from "../../utils/helpers.js";
import { showSuccess, showError } from "../../utils/toast.js";

export default function CategoryList() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const data = await getAllCategoriesAdmin();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!categories) return [];
    return categories.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter === "active" && !c.isActive) return false;
      if (statusFilter === "inactive" && c.isActive) return false;
      return true;
    });
  }, [categories, search, statusFilter]);

  const handleToggleStatus = (cat) => {
    confirmDialog({
      header: cat.isActive ? "Deactivate category" : "Activate category",
      message: `Are you sure you want to ${cat.isActive ? "deactivate" : "activate"} "${cat.title}"?`,
      acceptLabel: cat.isActive ? "Deactivate" : "Activate",
      acceptClassName: cat.isActive ? "p-button-[#9C4E3A]" : undefined,
      accept: async () => {
        try {
          await updateCategory(cat._id, { isActive: !cat.isActive });
          showSuccess(
            `Category ${cat.isActive ? "deactivated" : "activated"} successfully`,
          );
          load();
        } catch (err) {
          showError(err.response?.data?.message || "Failed to update category");
        }
      },
    });
  };

  const handleDelete = (cat) => {
    confirmDialog({
      header: "Delete category",
      message: `Are you sure you want to delete "${cat.title}"? This cannot be undone.`,
      acceptLabel: "Delete",
      acceptClassName: "p-button-[#9C4E3A]",
      accept: async () => {
        try {
          await deleteCategory(cat._id);
          showSuccess("Category deleted successfully");
          load();
        } catch (err) {
          showError(err.response?.data?.message || "Failed to delete category");
        }
      },
    });
  };

  if (error) {
    return (
      <div className="rc-card">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (!categories) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
        actions={
          <Link to="/admin/categories/add">
            <Button label="Add category" icon="pi pi-plus" />
          </Link>
        }
      />

      <div className="rc-card">
        <div className="tw:p-4 tw:flex tw:flex-wrap tw:gap-2.5 tw:border-b tw:border-[#E7E0CE]">
          <div className="tw:relative tw:w-56">
            <i className="pi pi-search tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-500" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="tw:w-full tw:pl-10"
            />
          </div>
          <Dropdown
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.value)}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            className="tw:w-40"
            placeholder="Status"
          />
          <Button
            label="Clear all"
            icon="pi pi-filter-slash"
            text
            onClick={() => {
              setSearch("");
              setStatusFilter(null);
            }}
          />
        </div>

        {filtered.length ? (
          <DataTable value={filtered} responsiveLayout="scroll" stripedRows>
            <Column
              header="Category"
              body={(c) => (
                <div className="tw:flex tw:items-center tw:gap-2.5">
                  <Thumb src={c.heroImg} size={38} />
                  <span className="tw:font-medium">{c.title}</span>
                </div>
              )}
            />
            {/* <Column
              header="Slug"
              body={(c) => <span className="mono">/{c.category}</span>}
            /> */}
            <Column field="menuGroup" header="Menu group" />
            <Column field="menuOrder" header="Order" />
            <Column
              header="Status"
              body={(c) => <ActiveBadge active={c.isActive} />}
            />
            <Column header="Created" body={(c) => formatDate(c.createdAt)} />
            <Column
              header=""
              body={(c) => (
                <div className="tw:flex tw:gap-1 tw:justify-end">
                  <Link to={`/admin/categories/${c._id}/edit`}>
                    <Button
                      icon="pi pi-pencil"
                      text
                      rounded
                      className="tw:!text-[#112E2A]"
                    />
                  </Link>
                  <Button
                    icon={c.isActive ? "pi pi-times" : "pi pi-check"}
                    text
                    rounded
                    onClick={() => handleToggleStatus(c)}
                    className="tw:!text-[#112E2A]"
                  />
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    severity="danger"
                    onClick={() => handleDelete(c)}
                  />
                </div>
              )}
            />
          </DataTable>
        ) : (
          <EmptyState
            icon="pi-tag"
            title="No categories available"
            subtitle="Try a different search, or create your first category."
            action={
              <Link to="/admin/categories/add">
                <Button label="Add category" icon="pi pi-plus" size="small" />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
