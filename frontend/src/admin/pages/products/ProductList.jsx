/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import { getAllProducts, deleteProduct } from "../../api/product.api.js";
import { getAllCategoriesAdmin } from "../../api/category.api.js";
import { getAllCollections } from "../../api/collection.api.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Thumb from "../../components/common/Thumb.jsx";
import { AvailabilityBadge } from "../../components/common/StatusBadge.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import { AVAILABILITY_OPTIONS } from "../../utils/constants.js";
import { showSuccess, showError } from "../../utils/toast.js";

const PAGE_SIZE = 8;

export default function ProductList() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(null);
  const [collFilter, setCollFilter] = useState(null);
  const [availFilter, setAvailFilter] = useState(null);
  const [first, setFirst] = useState(0);

  const load = async () => {
    setError(null);
    try {
      const [p, c, k] = await Promise.all([
        getAllProducts(),
        getAllCategoriesAdmin().catch(() => []),
        getAllCollections().catch(() => []),
      ]);
      setProducts(p);
      setCategories(c);
      setCollections(k);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (catFilter && p.category?._id !== catFilter) return false;
      if (collFilter && !p.collections?.some((c) => c._id === collFilter))
        return false;
      if (availFilter && p.availability !== availFilter) return false;
      return true;
    });
  }, [products, search, catFilter, collFilter, availFilter]);

  const paged = filtered.slice(first, first + PAGE_SIZE);

  const handleDelete = (p) => {
    confirmDialog({
      header: "Delete product",
      message: `Are you sure you want to delete "${p.name}"? This cannot be undone.`,
      acceptLabel: "Delete",
      acceptClassName: "p-button-[#9C4E3A]",

      accept: async () => {
        try {
          await deleteProduct(p._id);

          setProducts((currentProducts) => {
            const updatedProducts = currentProducts.filter(
              (product) => product._id !== p._id,
            );

            // If current page becomes empty, move back one page
            setFirst((currentFirst) => {
              if (currentFirst > 0 && currentFirst >= updatedProducts.length) {
                return Math.max(0, currentFirst - PAGE_SIZE);
              }

              return currentFirst;
            });

            return updatedProducts;
          });

          showSuccess("Product deleted successfully");
        } catch (err) {
          showError(err.response?.data?.message || "Failed to delete product");
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

  if (!products) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in your catalogue`}
        actions={
          <Link
            to="/admin/products/add"
            className="tw:block tw:w-full tw:sm:w-auto"
          >
            <Button
              label="Add product"
              icon="pi pi-plus"
              className=" tw:w-full tw:sm:w-auto"
            />
          </Link>
        }
      />

      <div className="rc-card">
        <div className="tw:p-3 tw:sm:p-4 tw:flex tw:flex-col tw:sm:flex-row tw:flex-wrap tw:gap-2.5 tw:border-b tw:border-[#E7E0CE]">
          <div className="tw:relative tw:w-full tw:sm:w-56">
            <i className="pi pi-search tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-500" />

            <InputText
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFirst(0);
              }}
              placeholder="Search products…"
              className="tw:w-full tw:pl-10"
            />
          </div>
          <div className="tw:grid tw:grid-cols-1 tw:sm:flex tw:gap-2.5 tw:w-full tw:sm:w-auto">
            <Dropdown
              value={catFilter}
              onChange={(e) => {
                setCatFilter(e.value);
                setFirst(0);
              }}
              options={[
                ...categories.map((c) => ({ label: c.title, value: c._id })),
              ]}
              className="tw:w-full tw:sm:w-44"
              placeholder="Category"
            />
            <Dropdown
              value={collFilter}
              onChange={(e) => {
                setCollFilter(e.value);
                setFirst(0);
              }}
              options={[
                ...collections.map((c) => ({ label: c.title, value: c._id })),
              ]}
              className="tw:w-full tw:sm:w-44"
              placeholder="Collection"
            />
            <Dropdown
              value={availFilter}
              onChange={(e) => {
                setAvailFilter(e.value);
                setFirst(0);
              }}
              options={[...AVAILABILITY_OPTIONS]}
              className="tw:w-full tw:sm:w-44"
              placeholder="Availability"
              showClear
            />
            <Button
              label="Clear all"
              icon="pi pi-filter-slash"
              text
              onClick={() => {
                setSearch("");
                setCatFilter(null);
                setCollFilter(null);
                setAvailFilter(null);
                setFirst(0);
              }}
            />
          </div>
        </div>

        {filtered.length ? (
          <>
            <div className="tw:overflow-x-auto">
              <DataTable
                value={paged}
                responsiveLayout="scroll"
                stripedRows
                className="tw:min-w-[720px]"
              >
                <Column
                  header="Product"
                  body={(p) => (
                    <div className="tw:flex tw:items-center tw:gap-2.5">
                      <Thumb src={p.image} size={38} />
                      <div>
                        <div className="tw:hidden tw:sm:flex tw:font-medium tw:text-[11px] tw:sm:text-[13px]">
                          {p.name}
                        </div>
                        <div className="tw:hidden tw:sm:flex tw:text-[11px] tw:text-[#9AA39B] mono">
                          {p.productCode}
                        </div>
                      </div>
                    </div>
                  )}
                />
                <Column
                  header="Code"
                  className="tw:sm:hidden tw:text-[11px]"
                  body={(p) => p.productCode || "—"}
                />
                <Column
                  header="Category"
                  className="tw:text-[11px] tw:sm:text-[13px]"
                  body={(p) => p.category?.title || "—"}
                />
                <Column
                  header="Price"
                  body={(p) => (
                    <span className="mono">
                      {formatCurrency(p.price)}
                      {p.compareAtPrice ? (
                        <span className="tw:text-[#9AA39B] tw:line-through tw:ml-1.5 tw:text-[11px]">
                          {formatCurrency(p.compareAtPrice)}
                        </span>
                      ) : null}
                    </span>
                  )}
                />
                <Column
                  header="Stock"
                  body={(p) =>
                    p.availability === "made-to-order" ? (
                      "—"
                    ) : (
                      <span className="mono">{p.stockLeft}</span>
                    )
                  }
                />
                <Column
                  header="Availability"
                  body={(p) => (
                    <AvailabilityBadge availability={p.availability} />
                  )}
                />
                <Column
                  header="Badge"
                  body={(p) =>
                    p.badge ? (
                      <span className="tw:border tw:border-[#AD8A3F] tw:text-[#AD8A3F] tw:text-[10.5px] tw:px-2 tw:py-0.5 tw:rounded">
                        {p.badge}
                      </span>
                    ) : (
                      "—"
                    )
                  }
                />
                <Column
                  header=""
                  body={(p) => (
                    <div className="tw:flex tw:gap-1 tw:justify-end">
                      <Link to={`/admin/products/${p._id}`}>
                        <Button
                          icon="pi pi-eye"
                          text
                          rounded
                          className="tw:!text-[#112E2A]"
                        />
                      </Link>
                      <Link to={`/admin/products/${p._id}/edit`}>
                        <Button
                          icon="pi pi-pencil"
                          text
                          rounded
                          className="tw:!text-[#112E2A]"
                        />
                      </Link>
                      <Button
                        icon="pi pi-trash"
                        text
                        rounded
                        severity="danger"
                        onClick={() => handleDelete(p)}
                      />
                    </div>
                  )}
                />
              </DataTable>
            </div>
            <div className="tw:p-3 tw:border-t tw:border-[#E7E0CE] tw:overflow-x-auto">
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
            icon="pi-shopping-bag"
            title="No products found"
            subtitle="Try adjusting your search or filters, or add a new product."
            action={
              <Link to="/admin/products/add">
                <Button label="Add product" icon="pi pi-plus" size="small" />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
