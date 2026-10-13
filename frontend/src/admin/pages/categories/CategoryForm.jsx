import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "../../api/category.api.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import { showSuccess, showError } from "../../utils/toast.js";

export default function CategoryForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = mode === "edit";

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [menuGroup, setMenuGroup] = useState(1);
  const [menuOrder, setMenuOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [heroImgFile, setHeroImgFile] = useState(null);
  const [heroImgPreview, setHeroImgPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editing) return;
    getCategoryById(id)
      .then((c) => {
        setTitle(c.title);
        setSlug(c.category);
        setMenuGroup(c.menuGroup);
        setMenuOrder(c.menuOrder);
        setIsActive(c.isActive);
        setHeroImgPreview(c.heroImg);
      })
      .catch((err) => showError(err.response?.data?.message || "Failed to load category"))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroImgFile(file);
    setHeroImgPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Category title is required.";
    if (!editing && !heroImgFile) errs.heroImg = "Hero image is required.";
    if (!editing && !slug.trim()) errs.slug = "Category slug is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError("Please fix the errors in the form");
      return;
    }
    setSaving(true);
    try {
      const payload = { title, slug, menuGroup, menuOrder, isActive, heroImgFile };
      if (editing) {
        await updateCategory(id, payload);
        showSuccess("Category updated successfully");
      } else {
        await createCategory(payload);
        showSuccess("Category created successfully");
      }
      navigate("/admin/categories");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    confirmDialog({
      header: "Discard changes?",
      message: "You have unsaved changes. Are you sure you want to leave without saving?",
      acceptLabel: "Discard",
      acceptClassName: "p-button-[#9C4E3A]",
      accept: () => navigate("/admin/categories"),
    });
  };

  if (loading) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <ProgressSpinner strokeWidth="3" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/categories" className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[12.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-3.5">
        <i className="pi pi-arrow-left tw:text-xs" /> Back to categories
      </Link>
      <PageHeader
        title={editing ? "Edit category" : "Add category"}
        subtitle={editing ? "Update category details" : "Create a new product category"}
      />

      <form onSubmit={handleSubmit}>
        <div className="rc-card tw:p-6 tw:max-w-xl tw:mb-5">
          <Field label="Category title" required error={errors.title}>
            <InputText value={title} onChange={(e) => setTitle(e.target.value)} className="tw:w-full" placeholder="e.g. Necklaces" />
          </Field>

          <Field label="Category slug" required={!editing} error={errors.slug} hint='Saved to the backend as the "category" field.'>
            <InputText value={slug} onChange={(e) => setSlug(e.target.value)} className="tw:w-full" placeholder="e.g. necklaces" />
          </Field>

          <Field label="Hero image" required={!editing} error={errors.heroImg}>
            <label className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:border tw:border-dashed tw:border-[#E7E0CE] tw:rounded-lg tw:py-6 tw:cursor-pointer tw:text-[#9AA39B] tw:text-[12.5px] tw:hover:border-[#AD8A3F]">
              {heroImgPreview ? (
                <img src={heroImgPreview} alt="" className="tw:h-24 tw:rounded-md tw:object-cover" />
              ) : (
                <i className="pi pi-upload tw:text-lg" />
              )}
              <span>{heroImgPreview ? "Click to replace" : "Click to upload hero image"}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="tw:hidden" />
            </label>
          </Field>

          <div className="tw:grid tw:grid-cols-2 tw:gap-4">
            <Field label="Menu group">
              <InputNumber value={menuGroup} onValueChange={(e) => setMenuGroup(e.value)} className="tw:w-full" inputClassName="tw:w-full" />
            </Field>
            <Field label="Menu order">
              <InputNumber value={menuOrder} onValueChange={(e) => setMenuOrder(e.value)} className="tw:w-full" inputClassName="tw:w-full" />
            </Field>
          </div>

          <label className="tw:flex tw:items-center tw:gap-2.5 tw:mt-1">
            <InputSwitch checked={isActive} onChange={(e) => setIsActive(e.value)} />
            <span className="tw:text-[13px] tw:text-[#5E6D67]">Active</span>
          </label>
        </div>

        <div className="tw:flex tw:gap-2.5 tw:justify-end">
          <Button type="button" label="Cancel" outlined onClick={handleCancel} />
          <Button type="submit" label={editing ? "Save changes" : "Create category"} icon="pi pi-check" loading={saving} />
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="tw:mb-4">
      <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
        {label} {required && <span className="tw:text-[#9C4E3A]">*</span>}
      </label>
      {children}
      {hint && !error && <div className="tw:text-[11px] tw:text-[#9AA39B] tw:mt-1">{hint}</div>}
      {error && <div className="tw:text-[11.5px] tw:text-[#9C4E3A] tw:mt-1">{error}</div>}
    </div>
  );
}
