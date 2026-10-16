/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import {
  getProductById,
  updateProductStock,
  toggleProductStatus,
} from "../../api/product.api.js";
import { NotImplementedError } from "../../api/axiosClient.js";
import EmptyState from "../../components/common/EmptyState.jsx";
import NotImplementedNotice from "../../components/common/NotImplementedNotice.jsx";
import { formatCurrency, formatDate } from "../../utils/helpers.js";
import { showSuccess, showError } from "../../utils/toast.js";

/* Change this if your router mounts the product list somewhere else (e.g. "/admin/products") */
const PRODUCTS_PATH = "/admin/products";

/* ---------- shared class strings ---------- */
const CARD =
  "tw:bg-white tw:border tw:border-[#EDE6D6] tw:rounded-2xl tw:p-[26px]";

/* PrimeReact styles are un-layered, so Tailwind (v4) needs the trailing "!" to win */
const BTN_BASE =
  "tw:rounded-lg! tw:px-[18px]! tw:py-[11px]! tw:text-[14px]! tw:font-medium! tw:gap-2 tw:shadow-none!";
const BTN_GHOST =
  BTN_BASE +
  " tw:bg-white! tw:text-[#1C2B28]! tw:border! tw:border-[#E7E0CE]! tw:hover:bg-[#F6F1E6]!";
const BTN_PRIMARY =
  BTN_BASE +
  " tw:bg-[#1E4D45]! tw:text-white! tw:border! tw:border-[#1E4D45]! tw:hover:bg-[#173B35]!";

/* ---------- small pieces ---------- */
const PILL_TONES = {
  green: { wrap: "tw:bg-[#E6F0EA] tw:text-[#1C2B28]", dot: "tw:bg-[#1E4D45]" },
  red: { wrap: "tw:bg-[#F8E6E3] tw:text-[#8F3328]", dot: "tw:bg-[#B4443A]" },
  amber: { wrap: "tw:bg-[#F6EBD6] tw:text-[#7E5B1C]", dot: "tw:bg-[#B8924F]" },
  gray: { wrap: "tw:bg-[#EEEBE3] tw:text-[#5E6D67]", dot: "tw:bg-[#9AA39E]" },
};

function Pill({ tone = "green", children }) {
  const t = PILL_TONES[tone];
  return (
    <span
      className={`tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:px-3 tw:py-[5px] tw:text-[12.5px] tw:font-medium ${t.wrap}`}
    >
      <span className={`tw:w-1.5 tw:h-1.5 tw:rounded-full ${t.dot}`} />
      {children}
    </span>
  );
}

function availabilityMeta(availability) {
  const key = String(availability || "").replace(/_/g, "-");
  if (key === "made-to-order") return { label: "Made to order", tone: "amber" };
  if (key === "out-of-stock") return { label: "Out of stock", tone: "red" };
  return { label: "In stock", tone: "green" };
}

/* Lucide "gem" icon – used as the image placeholder */
function GemIcon({ className = "", strokeWidth = 1.7 }) {
  return (
    <svg
      viewBox="1 2 22 21"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3h12l4 6-10 13L2 9Z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}

function Kv({ label, value }) {
  return (
    <div>
      <div className="tw:text-[12.5px] tw:text-[#9AA39E] tw:mb-1">{label}</div>
      <div className="tw:text-[15px] tw:text-[#1C2B28]">{value}</div>
    </div>
  );
}

function DetailBlock({ title, text }) {
  if (!text) return null;
  return (
    <div className="tw:mb-4 tw:last:mb-0">
      <div className="font-display tw:text-[16.5px] tw:text-[#1C2B28] tw:mb-1">
        {title}
      </div>
      <div className="tw:text-[13.5px] tw:leading-relaxed tw:text-[#9A9A92]">
        {text}
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function AdminProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stockModal, setStockModal] = useState(false);
  const [stockMode, setStockMode] = useState("add");
  const [qty, setQty] = useState(1);
  const [niError, setNiError] = useState(null);

  const load = () => {
    setLoading(true);
    setActiveImg(0);
    getProductById(id)
      .then(setProduct)
      .catch((err) =>
        showError(err.response?.data?.message || "Failed to load product"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleToggleStatus = () => {
    const willActivate = product.isActive === false;
    confirmDialog({
      header: willActivate ? "Activate product" : "Deactivate product",
      message: `Are you sure you want to ${willActivate ? "activate" : "deactivate"} "${product.name}"?`,
      acceptClassName: willActivate ? undefined : "p-button-[#9C4E3A]",
      accept: async () => {
        try {
          const updated = await toggleProductStatus(product._id, willActivate);
          setProduct((p) => ({
            ...p,
            isActive: updated?.isActive ?? willActivate,
          }));
          showSuccess(
            `Product ${willActivate ? "activated" : "deactivated"} successfully`,
          );
        } catch (err) {
          if (err instanceof NotImplementedError) setNiError(err);
          else
            showError(
              err.response?.data?.message || "Failed to update product status",
            );
        }
      },
    });
  };

  const applyStockChange = async (modeOverride) => {
    const mode = modeOverride || stockMode;
    try {
      const updated = await updateProductStock(product._id, {
        mode,
        quantity: qty,
      });
      setProduct((p) => ({
        ...p,
        stockLeft: updated?.stockLeft ?? p.stockLeft,
        availability: updated?.availability ?? p.availability,
      }));
      setStockModal(false);
      showSuccess("Stock updated successfully");
    } catch (err) {
      if (err instanceof NotImplementedError) {
        setNiError(err);
        setStockModal(false);
      } else {
        showError(err.response?.data?.message || "Failed to update stock");
      }
    }
  };

  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={CARD}>
        <EmptyState
          icon="pi-shopping-bag"
          title="Product not found"
          subtitle="This product may have been removed."
          action={
            <Link to={PRODUCTS_PATH}>
              <Button label="Back to products" size="small" />
            </Link>
          }
        />
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const slots = allImages.length ? allImages : [null, null, null]; // placeholder thumbnails
  const isMadeToOrder =
    product.availability === "made-to-order" ||
    product.availability === "made_to_order";
  const avail = availabilityMeta(product.availability);
  const isActive = product.isActive !== false;
  const stockText = isMadeToOrder
    ? "Made to order"
    : `${product.stockLeft ?? 0} ${product.stockLeft === 1 ? "unit" : "units"}`;

  return (
    <div>
      
      {/* Back link */}
      <Link
        to={PRODUCTS_PATH}
        className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[13.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-4"
      >
        <i className="pi pi-angle-left tw:text-sm" /> Back to products
      </Link>

      <NotImplementedNotice error={niError} />

      {/* Title + actions */}
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-4 tw:flex-wrap tw:mb-5">
        <div>
          <h2 className="font-display tw:text-[26px] tw:sm:text-[30px] tw:leading-tight tw:m-0 tw:text-[#1C2B28]">
            {product.name}
          </h2>
          <div className="tw:text-[14px] tw:text-[#8A928D] tw:mt-1.5">
            Product ID: {product.productCode}
          </div>
        </div>

        <div className="tw:flex tw:gap-3 tw:flex-wrap">
          <Button
            label="Update stock"
            icon="pi pi-box"
            className={BTN_GHOST}
            onClick={() => setStockModal(true)}
          />
          <Button
            label={isActive ? "Deactivate" : "Activate"}
            icon={isActive ? "pi pi-times" : "pi pi-check"}
            className={BTN_GHOST}
            onClick={handleToggleStatus}
          />
          <Link
            to={`${PRODUCTS_PATH}/${product._id}/edit`}
            className="tw:no-underline"
          >
            <Button
              label="Edit product"
              icon="pi pi-pencil"
              className={BTN_PRIMARY}
            />
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[1.1fr_1.4fr] tw:gap-6">
        {/* Gallery */}
        <div className={CARD}>
          <div className="tw:aspect-square tw:rounded-2xl tw:overflow-hidden tw:bg-[#E7F0EA] tw:flex tw:items-center tw:justify-center">
            {allImages[activeImg] ? (
              <img
                src={allImages[activeImg]}
                alt={product.name}
                className="tw:w-full tw:h-full tw:object-cover"
              />
            ) : (
              <GemIcon className="tw:w-[88%] tw:h-[88%] tw:text-[#1E4D45]" />
            )}
          </div>

          {slots.length > 1 && (
            <div className="tw:flex tw:gap-2.5 tw:mt-4 tw:flex-wrap">
              {slots.map((src, i) => {
                const active = activeImg === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={
                      "tw:w-[70px] tw:h-[70px] tw:rounded-lg tw:overflow-hidden tw:p-0 tw:cursor-pointer tw:flex tw:items-center tw:justify-center tw:bg-[#F1ECDF] tw:border " +
                      (active ? "tw:border-[#1E4D45]" : "tw:border-transparent")
                    }
                  >
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        className="tw:w-full tw:h-full tw:object-cover"
                      />
                    ) : i === 0 ? (
                      <GemIcon
                        className="tw:w-[46px] tw:h-[46px] tw:text-[#9AA59E]"
                        strokeWidth={1.6}
                      />
                    ) : (
                      <span className="font-display tw:text-[16px] tw:text-[#A39D8C]">
                        {i + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={CARD}>
          <div className="tw:flex tw:gap-2 tw:items-center tw:mb-3.5 tw:flex-wrap">
            <Pill tone={isActive ? "green" : "gray"}>
              {isActive ? "Active" : "Inactive"}
            </Pill>
            <Pill tone={avail.tone}>{avail.label}</Pill>
            {product.badge && (
              <span className="tw:border tw:border-[#B8924F] tw:text-[#A9803F] tw:text-[11.5px] tw:tracking-wide tw:uppercase tw:px-2.5 tw:py-1 tw:rounded-lg">
                {product.badge}
              </span>
            )}
          </div>

          <div className="tw:flex tw:items-baseline tw:gap-2.5 tw:mb-5">
            <span className="font-display tw:text-[30px] tw:leading-none tw:text-[#1C2B28]">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="font-display tw:text-[18px] tw:text-[#B3A78E] tw:line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-y-[22px] tw:gap-x-6 tw:mb-6">
            <Kv label="Category" value={product.category?.title || "—"} />
            <Kv label="Subcategory" value={product.subcategory || "—"} />
            <Kv
              label="Collections"
              value={
                (product.collections || []).map((c) => c.title).join(", ") ||
                "—"
              }
            />
            <Kv label="Material" value={product.material || "—"} />
            <Kv label="Stock" value={stockText} />
            <Kv label="Craft label" value={product.craftLabel || "—"} />
            <Kv label="Created" value={formatDate(product.createdAt)} />
            <Kv label="Last updated" value={formatDate(product.updatedAt)} />
          </div>

          <div className="tw:border-t tw:border-[#EDE6D6] tw:pt-6">
            <DetailBlock title="Details" text={product.details} />
            <DetailBlock title="Care instructions" text={product.care} />
            <DetailBlock title="Shipping information" text={product.shipping} />
          </div>
        </div>
      </div>

      {/* Update stock dialog */}
      <Dialog
        header="Update stock"
        visible={stockModal}
        onHide={() => setStockModal(false)}
        style={{ width: 380 }}
        draggable={false}
      >
        <div className="tw:mb-4 tw:bg-[#F6F1E6] tw:rounded-lg tw:px-4 tw:py-3">
          <div className="tw:text-[11.5px] tw:text-[#9AA39E]">
            Current stock
          </div>
          <div className="font-display tw:text-xl tw:text-[#1C2B28]">
            {isMadeToOrder ? "Made to order" : product.stockLeft}
          </div>
        </div>

        <div className="tw:flex tw:gap-1.5 tw:bg-[#F6F1E6] tw:p-1 tw:rounded-lg tw:mb-4">
          {[
            ["add", "Add"],
            ["remove", "Remove"],
            ["set", "Set"],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setStockMode(val)}
              className={
                "tw:flex-1 tw:text-[13px] tw:py-1.5 tw:rounded-md tw:border-0 tw:cursor-pointer " +
                (stockMode === val
                  ? "tw:bg-white tw:text-[#1C2B28] tw:shadow-sm"
                  : "tw:bg-transparent tw:text-[#8A928D]")
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="tw:mb-4">
          <label className="tw:block tw:text-[12.5px] tw:text-[#5E6D67] tw:mb-1.5">
            Quantity
          </label>
          <InputNumber
            value={qty}
            onValueChange={(e) => setQty(e.value ?? 0)}
            min={stockMode === "set" ? 0 : 1}
            className="tw:w-full"
            inputClassName="tw:w-full"
          />
        </div>

        <div className="tw:flex tw:flex-col tw:gap-2 tw:mb-2">
          <Button
            label="Mark out of stock"
            className={BTN_GHOST}
            onClick={() => applyStockChange("out_of_stock")}
          />
          <Button
            label="Mark made to order"
            className={BTN_GHOST}
            onClick={() => applyStockChange("made_to_order")}
          />
        </div>
        <Button
          label="Apply change"
          className={BTN_PRIMARY + " tw:w-full tw:justify-center"}
          onClick={() => applyStockChange()}
        />
      </Dialog>
    </div>
  );
}
