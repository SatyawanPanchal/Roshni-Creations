import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import {
  getProductById,
  createProduct,
  updateProduct,
} from "../../api/product.api.js";

import { getAllCategoriesAdmin } from "../../api/category.api.js";
import { getAllCollections } from "../../api/collection.api.js";

import { NotImplementedError } from "../../api/axiosClient.js";

import PageHeader from "../../components/common/PageHeader.jsx";
import NotImplementedNotice from "../../components/common/NotImplementedNotice.jsx";

import { AVAILABILITY_OPTIONS, BADGE_OPTIONS } from "../../utils/constants.js";

import { showSuccess, showError } from "../../utils/toast.js";

export default function ProductForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [collectionOptions, setCollectionOptions] = useState([]);

  const [niError, setNiError] = useState(null);
  const [errors, setErrors] = useState({});

  const MAX_ADDITIONAL_IMAGES = 5;

  // ------------------------------------------------------------
  // FORM
  // ------------------------------------------------------------

  const [form, setForm] = useState({
    name: "",
    productCode: "",
    category: null,
    subcategory: "",
    collections: [],
    material: "",
    price: null,
    compareAtPrice: null,
    availability: "in-stock",
    stockLeft: 0,
    badge: "",
    craftLabel: "",
    details: "",
    care: "",
    shipping: "",
  });

  // ------------------------------------------------------------
  // MAIN IMAGE
  // ------------------------------------------------------------

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ------------------------------------------------------------
  // ADDITIONAL IMAGES
  //
  // Every slot looks like:
  //
  // {
  //   preview: "https://cloudinary....",
  //   existing: true,
  //   file: null
  // }
  //
  // OR:
  //
  // {
  //   preview: "blob:http....",
  //   existing: false,
  //   file: File
  // }
  // ------------------------------------------------------------

  const [additionalImages, setAdditionalImages] = useState([]);

  // ------------------------------------------------------------
  // FORM SETTER
  // ------------------------------------------------------------

  const set = (key) => (val) => {
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getAllCategoriesAdmin().catch(() => []),
      getAllCollections().catch(() => []),
      editing ? getProductById(id) : Promise.resolve(null),
    ])
      .then(([cats, colls, product]) => {
        if (!mounted) return;

        setCategories(cats || []);
        setCollectionOptions(colls || []);

        if (product) {
          // ----------------------------------------------------
          // FORM DATA
          // ----------------------------------------------------

          setForm({
            name: product.name || "",
            productCode: product.productCode || "",
            category: product.category?._id || null,
            subcategory: product.subcategory || "",
            collections: (product.collections || []).map(
              (collection) => collection._id,
            ),
            material: product.material || "",
            price: product.price ?? null,
            compareAtPrice: product.compareAtPrice ?? null,
            availability: product.availability || "in-stock",
            stockLeft: product.stockLeft ?? 0,
            badge: product.badge || "",
            craftLabel: product.craftLabel || "",
            details: product.details || "",
            care: product.care || "",
            shipping: product.shipping || "",
          });

          // ----------------------------------------------------
          // MAIN IMAGE
          // ----------------------------------------------------

          setImagePreview(product.image || null);

          // ----------------------------------------------------
          // ADDITIONAL IMAGES
          // ----------------------------------------------------
          //
          // Convert backend URLs into image slot objects.
          // ----------------------------------------------------

          setAdditionalImages(
            (product.images || []).map((url) => ({
              preview: url,
              existing: true,
              file: null,
            })),
          );
        }
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Failed to load product");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id, editing]);

  // ============================================================
  // MAIN IMAGE
  // ============================================================

  const handleMainImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));

    // Allows selecting same file again
    e.target.value = "";
  };

  // ============================================================
  // ADD NEW ADDITIONAL IMAGES
  // ============================================================

  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots = MAX_ADDITIONAL_IMAGES - additionalImages.length;

    if (remainingSlots <= 0) {
      showError(
        `You can upload maximum ${MAX_ADDITIONAL_IMAGES} additional images.`,
      );
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const newImages = selectedFiles.map((file) => ({
      preview: URL.createObjectURL(file),
      existing: false,
      file,
    }));

    setAdditionalImages((prev) => [...prev, ...newImages]);

    // Allows selecting same file again
    e.target.value = "";
  };

  // ============================================================
  // REPLACE SPECIFIC ADDITIONAL IMAGE
  // ============================================================

  const handleReplaceAdditionalImage = (e, index) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const newPreview = URL.createObjectURL(file);

    setAdditionalImages((prev) => {
      const updated = [...prev];

      updated[index] = {
        preview: newPreview,
        existing: false,
        file,
      };

      return updated;
    });

    // Allows selecting same file again
    e.target.value = "";
  };

  // ============================================================
  // REMOVE ADDITIONAL IMAGE
  // ============================================================

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Product name is required.";
    }

    if (!form.productCode.trim()) {
      errs.productCode = "Product code is required.";
    }

    if (!form.category) {
      errs.category = "Category is required.";
    }

    if (!form.price || form.price <= 0) {
      errs.price = "Enter a valid price.";
    }

    if (!editing && !imageFile) {
      errs.image = "Main image is required.";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNiError(null);

    if (!validate()) {
      showError("Please fix the errors in the form");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        imageFile,

        imagesFiles: editing
          ? []
          : additionalImages
              .filter((image) => !image.existing && image.file)
              .map((image) => image.file),

        existingImages: editing
          ? additionalImages
              .filter((image) => image.existing)
              .map((image) => image.preview)
          : undefined,

        replacementImages: editing
          ? additionalImages
              .map((image, index) => ({
                index,
                file: image.existing ? null : image.file,
              }))
              .filter((item) => item.file)
          : [],
      };

      if (editing) {
        await updateProduct(id, payload);

        showSuccess("Product updated successfully");

        navigate(`/admin/products/${id}`);
      } else {
        const created = await createProduct(payload);

        showSuccess("Product created successfully");

        navigate(`/admin/products/${created._id}`);
      }
    } catch (err) {
      if (err instanceof NotImplementedError) {
        setNiError(err);
      } else {
        showError(err.response?.data?.message || "Failed to save product");
      }
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {
    confirmDialog({
      header: "Discard changes?",
      message:
        "You have unsaved changes. Are you sure you want to leave without saving?",
      acceptLabel: "Discard",
      acceptClassName: "p-button-[#9C4E3A]",
      accept: () => navigate("/admin/products"),
    });
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner
          strokeWidth="3"
          style={{
            width: 36,
            height: 36,
          }}
        />
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div>
      {/* BACK */}
      <Link
        to="/admin/products"
        className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[12.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-3.5"
      >
        <i className="pi pi-arrow-left tw:text-xs" />
        Back to products
      </Link>

      {/* HEADER */}
      <PageHeader
        title={editing ? "Edit product" : "Add product"}
        subtitle={
          editing
            ? "Update details for this product"
            : "Fill in the details to list a new product"
        }
      />

      <NotImplementedNotice error={niError} />

      <form onSubmit={handleSubmit}>
        {/* ================================================== */}
        {/* BASIC INFORMATION */}
        {/* ================================================== */}

        <div className="rc-card tw:p-6 tw:mb-4">
          <SectionTitle
            title="Basic information"
            subtitle="Name, category and material"
          />

          <Field label="Product name" required error={errors.name}>
            <InputText
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              className="tw:w-full"
              placeholder="e.g. Meenakari Kundan Choker"
            />
          </Field>

          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-4">
            <Field
              label="Product code"
              required
              error={errors.productCode}
              hint="Must be unique, e.g. RC-NCK-001"
            >
              <InputText
                value={form.productCode}
                onChange={(e) => set("productCode")(e.target.value)}
                className="tw:w-full"
              />
            </Field>

            <Field label="Category" required error={errors.category}>
              <Dropdown
                value={form.category}
                onChange={(e) => set("category")(e.value)}
                options={categories.map((c) => ({
                  label: c.title,
                  value: c._id,
                }))}
                placeholder="Select category"
                className="tw:w-full"
              />
            </Field>
          </div>

          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-4">
            <Field label="Subcategory">
              <InputText
                value={form.subcategory}
                onChange={(e) => set("subcategory")(e.target.value)}
                className="tw:w-full"
                placeholder="e.g. Choker"
              />
            </Field>

            <Field label="Material">
              <InputText
                value={form.material}
                onChange={(e) => set("material")(e.target.value)}
                className="tw:w-full"
                placeholder="e.g. Gold-plated brass"
              />
            </Field>
          </div>

          <Field label="Collections">
            <MultiSelect
              value={form.collections}
              onChange={(e) => set("collections")(e.value)}
              options={collectionOptions.map((c) => ({
                label: c.title,
                value: c._id,
              }))}
              display="chip"
              placeholder="Select collections"
              className="tw:w-full"
            />
          </Field>
        </div>

        {/* ================================================== */}
        {/* PRICING */}
        {/* ================================================== */}

        <div className="rc-card tw:p-6 tw:mb-4">
          <SectionTitle
            title="Pricing"
            subtitle="Set the selling and comparison price"
          />

          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-4">
            <Field label="Price (₹)" required error={errors.price}>
              <InputNumber
                value={form.price}
                onValueChange={(e) => set("price")(e.value)}
                className="tw:w-full"
                inputClassName="tw:w-full"
                mode="decimal"
              />
            </Field>

            <Field label="Compare-at price (₹)">
              <InputNumber
                value={form.compareAtPrice}
                onValueChange={(e) => set("compareAtPrice")(e.value)}
                className="tw:w-full"
                inputClassName="tw:w-full"
                mode="decimal"
                placeholder="Optional"
              />
            </Field>
          </div>
        </div>

        {/* ================================================== */}
        {/* INVENTORY */}
        {/* ================================================== */}

        <div className="rc-card tw:p-6 tw:mb-4">
          <SectionTitle
            title="Inventory"
            subtitle="Availability and stock tracking"
          />

          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-3 tw:gap-4">
            <Field label="Availability">
              <Dropdown
                value={form.availability}
                onChange={(e) => set("availability")(e.value)}
                options={AVAILABILITY_OPTIONS}
                className="tw:w-full"
              />
            </Field>

            <Field label="Stock left">
              <InputNumber
                value={form.stockLeft}
                onValueChange={(e) => set("stockLeft")(e.value)}
                className="tw:w-full"
                inputClassName="tw:w-full"
                min={0}
              />
            </Field>

            <Field label="Badge">
              <Dropdown
                value={form.badge}
                onChange={(e) => set("badge")(e.value)}
                options={BADGE_OPTIONS}
                optionLabel="label"
                optionValue="value"
                className="tw:w-full"
                placeholder="Select badge"
              />
            </Field>
          </div>

          <Field label="Craft label">
            <InputText
              value={form.craftLabel}
              onChange={(e) => set("craftLabel")(e.target.value)}
              className="tw:w-full"
              placeholder="e.g. Hand-set kundan work"
            />
          </Field>
        </div>

        {/* ================================================== */}
        {/* PRODUCT IMAGES */}
        {/* ================================================== */}

        <div className="rc-card tw:p-6 tw:mb-4">
          <SectionTitle
            title="Product images"
            subtitle={`Replace existing images or add new images. Up to ${MAX_ADDITIONAL_IMAGES} additional images.`}
          />

          {/* ================= MAIN IMAGE ================= */}

          <Field label="Main image" required error={errors.image}>
            <label className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:border tw:border-dashed tw:border-[#E7E0CE] tw:rounded-lg tw:py-6 tw:cursor-pointer tw:text-[#9AA39B] tw:text-[12.5px] tw:borhover:der-[#AD8A3F]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Main product"
                  className="tw:h-32 tw:w-32 tw:rounded-md tw:object-cover"
                />
              ) : (
                <i className="pi pi-upload tw:text-lg" />
              )}

              <span>
                {imagePreview
                  ? "Click to replace"
                  : "Click to upload main image"}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleMainImage}
                className="tw:hidden"
              />
            </label>
          </Field>

          {/* ================= ADDITIONAL IMAGES ================= */}

          <Field label={`Additional images (${additionalImages.length}/${MAX_ADDITIONAL_IMAGES})`}>
            <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-4 tw:gap-3">
              {additionalImages.map((image, index) => (
                <div
                  key={index}
                  className="tw:relative tw:aspect-square tw:rounded-md tw:overflow-hidden tw:border tw:border-[#E7E0CE] tw:bg-[#FAF8F3]"
                >
                  {/* IMAGE */}
                  <img
                    src={image.preview}
                    alt={`Product image ${index + 1}`}
                    className="tw:w-full tw:h-full tw:object-cover"
                  />

                  {/* REPLACE CLICK AREA */}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`replace-image-${index}`)?.click()
                    }
                    className="tw:absolute tw:inset-0 tw:w-full tw:h-full tw:bg-transparent tw:hover:bg-black/30 tw:border-0 tw:cursor-pointer tw:flex tw:items-center tw:justify-center tw:transition-all"
                  >
                    <span className="tw:opacity-0 tw:hover:opacity-100 tw:bg-black/70 tw:text-white tw:px-3 tw:py-1.5 tw:rounded-md tw:text-[11px]">
                      Replace image
                    </span>
                  </button>

                  {/* HIDDEN FILE INPUT */}
                  <input
                    id={`replace-image-${index}`}
                    type="file"
                    accept="image/*"
                    className="tw:hidden"
                    onChange={(e) => handleReplaceAdditionalImage(e, index)}
                  />

                  {/* REMOVE */}
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="tw:absolute tw:top-1.5 tw:right-1.5 tw:z-10 tw:w-6 tw:h-6 tw:rounded-full tw:bg-black/60 tw:text-white tw:flex tw:items-center tw:justify-center tw:border-0 tw:cursor-pointer tw:hover:bg-black/80"
                  >
                    <i className="pi pi-times tw:text-[9px]" />
                  </button>

                  {/* IMAGE NUMBER */}
                  <div className="tw:absolute tw:bottom-1.5 tw:left-1.5 tw:z-10 tw:px-1.5 tw:py-0.5 tw:rounded tw:bg-black/60 tw:text-white tw:text-[9px]">
                    Image {index + 1}
                  </div>
                </div>
              ))}

              {/* ADD NEW IMAGE */}
              {additionalImages.length < MAX_ADDITIONAL_IMAGES && (
                <label className="tw:aspect-square tw:rounded-md tw:border tw:border-dashed tw:border-[#E7E0CE] tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:cursor-pointer tw:text-[#9AA39B] tw:borhover:der-[#AD8A3F]">
                  <i className="pi pi-plus tw:text-sm" />

                  <span className="tw:text-[11px]">Add image</span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImages}
                    className="tw:hidden"
                  />
                </label>
              )}
            </div>

            <div className="tw:text-[11px] tw:text-[#9AA39B] tw:mt-2">
              Click any image to replace it.
            </div>
          </Field>
        </div>

        {/* ================================================== */}
        {/* DESCRIPTION */}
        {/* ================================================== */}

        <div className="rc-card tw:p-6 tw:mb-5">
          <SectionTitle
            title="Description"
            subtitle="Details, care and shipping information"
          />

          <Field label="Details">
            <InputTextarea
              value={form.details}
              onChange={(e) => set("details")(e.target.value)}
              rows={3}
              className="tw:w-full"
            />
          </Field>

          <Field label="Care instructions">
            <InputTextarea
              value={form.care}
              onChange={(e) => set("care")(e.target.value)}
              rows={2}
              className="tw:w-full"
            />
          </Field>

          <Field label="Shipping information">
            <InputTextarea
              value={form.shipping}
              onChange={(e) => set("shipping")(e.target.value)}
              rows={2}
              className="tw:w-full"
            />
          </Field>
        </div>

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div className="tw:flex tw:gap-2.5 tw:justify-end">
          <Button
            type="button"
            label="Cancel"
            outlined
            onClick={handleCancel}
          />

          <Button
            type="submit"
            label={editing ? "Save changes" : "Save product"}
            icon="pi pi-check"
            loading={saving}
          />
        </div>
      </form>
    </div>
  );
}

// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({ title, subtitle }) {
  return (
    <div className="tw:mb-4">
      <div className="font-display tw:text-base">{title}</div>

      <div className="tw:text-[12px] tw:text-[#9AA39B]">{subtitle}</div>
    </div>
  );
}

// ============================================================
// FIELD
// ============================================================

function Field({ label, required, error, hint, children }) {
  return (
    <div className="tw:mb-4">
      <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
        {label} {required && <span className="tw:text-[#9C4E3A]">*</span>}
      </label>

      {children}

      {hint && !error && (
        <div className="tw:text-[11px] tw:text-[#9AA39B] tw:mt-1">{hint}</div>
      )}

      {error && (
        <div className="tw:text-[11.5px] tw:text-[#9C4E3A] tw:mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
