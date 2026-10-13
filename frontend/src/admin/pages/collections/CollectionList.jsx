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

import { getAllCollections, updateCollection, deleteCollection } from "../../api/collection.api.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Thumb from "../../components/common/Thumb.jsx";
import { ActiveBadge } from "../../components/common/StatusBadge.jsx";
import { formatDate } from "../../utils/helpers.js";
import { showSuccess, showError } from "../../utils/toast.js";

export default function CollectionList() {
  const [collections, setCollections] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setCollections(await getAllCollections());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load collections");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!collections) return [];
    return collections.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter === "active" && !c.isActive) return false;
      if (statusFilter === "inactive" && c.isActive) return false;
      return true;
    });
  }, [collections, search, statusFilter]);

  const handleToggleStatus = (col) => {
    confirmDialog({
      header: col.isActive ? "Deactivate collection" : "Activate collection",
      message: `Are you sure you want to ${col.isActive ? "deactivate" : "activate"} "${col.title}"?`,
      acceptLabel: col.isActive ? "Deactivate" : "Activate",
      acceptClassName: col.isActive ? "p-button-[#9C4E3A]" : undefined,
      accept: async () => {
        try {
          await updateCollection(col._id, { isActive: !col.isActive });
          showSuccess(`Collection ${col.isActive ? "deactivated" : "activated"} successfully`);
          load();
        } catch (err) {
          showError(err.response?.data?.message || "Failed to update collection");
        }
      },
    });
  };

  const handleDelete = (col) => {
    confirmDialog({
      header: "Delete collection",
      message: `Are you sure you want to delete "${col.title}"? This cannot be undone.`,
      acceptLabel: "Delete",
      acceptClassName: "p-button-[#9C4E3A]",
      accept: async () => {
        try {
          await deleteCollection(col._id);
          showSuccess("Collection deleted successfully");
          load();
        } catch (err) {
          showError(err.response?.data?.message || "Failed to delete collection");
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

  if (!collections) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        subtitle={`${collections.length} curated collections`}
        actions={
          <Link to="/admin/collections/add">
            <Button label="Add collection" icon="pi pi-plus"/>
          </Link>
        }
      />

      <div className="rc-card">
        <div className="tw:p-4 tw:flex tw:flex-wrap tw:gap-2.5 tw:border-b tw:border-[#E7E0CE]">
          <div className="tw:relative tw:w-56">
            <i className="pi pi-search tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-500" />
            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search collections…" className="tw:w-full tw:pl-10" />
          </div>
          <Dropdown
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.value)}
            options={[
              { label: "All status", value: null },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            className="tw:w-40"
            placeholder="Status"
          />
        </div>

        {filtered.length ? (
          <DataTable value={filtered} responsiveLayout="scroll" stripedRows>
            <Column
              header="Collection"
              body={(c) => (
                <div className="tw:flex tw:items-center tw:gap-2.5">
                  <Thumb src={c.image} gold size={38} />
                  <span className="tw:font-medium">{c.title}</span>
                </div>
              )}
            />
            <Column header="Description" body={(c) => <span className="tw:line-clamp-2 tw:max-w-xs tw:block">{c.description || "—"}</span>} />
            <Column header="Slug" body={(c) => <span className="mono">/{c.slug}</span>} />
            <Column header="Status" body={(c) => <ActiveBadge active={c.isActive} />} />
            <Column header="Created" body={(c) => formatDate(c.createdAt)} />
            <Column
              header=""
              body={(c) => (
                <div className="tw:flex tw:gap-1 tw:justify-end">
                  <Link to={`/admin/collections/${c._id}/edit`}>
                    <Button icon="pi pi-pencil" text rounded className="tw:!text-[#112E2A]"/>
                  </Link>
                  <Button icon={c.isActive ? "pi pi-times" : "pi pi-check"} text rounded onClick={() => handleToggleStatus(c)} className="tw:!text-[#112E2A]" />
                  <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => handleDelete(c)} />
                </div>
              )}
            />
          </DataTable>
        ) : (
          <EmptyState
            icon="pi-th-large"
            title="No collections available"
            subtitle="Group your products into a themed collection."
            action={
              <Link to="/admin/collections/add">
                <Button label="Add collection" icon="pi pi-plus" size="small" />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
