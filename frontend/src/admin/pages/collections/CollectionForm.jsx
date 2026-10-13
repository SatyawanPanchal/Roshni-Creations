import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import { getCollectionById, createCollection, updateCollection } from "../../api/collection.api.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import { showSuccess, showError } from "../../utils/toast.js";

export default function CollectionForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = mode === "edit";

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editing) return;
    getCollectionById(id)
      .then((c) => {
        setTitle(c.title);
        setSlug(c.slug);
        setDescription(c.description || "");
        setIsActive(c.isActive);
        setImagePreview(c.image);
      })
      .catch((err) => showError(err.response?.data?.message || "Failed to load collection"))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Collection name is required.";
    if (!slug.trim()) errs.slug = "Slug is required.";
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
      const payload = { title, slug, description, isActive, imageFile };
      if (editing) {
        await updateCollection(id, payload);
        showSuccess("Collection updated successfully");
      } else {
        await createCollection(payload);
        showSuccess("Collection created successfully");
      }
      navigate("/admin/collections");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save collection");
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
      accept: () => navigate("/admin/collections"),
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
      <Link to="/admin/collections" className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[12.5px] tw:text-[#5E6D67] tw:no-underline tw:mb-3.5">
        <i className="pi pi-arrow-left tw:text-xs" /> Back to collections
      </Link>
      <PageHeader
        title={editing ? "Edit collection" : "Add collection"}
        subtitle={editing ? "Update collection details" : "Create a new curated collection"}
      />

      <form onSubmit={handleSubmit}>
        <div className="rc-card tw:p-6 tw:max-w-xl tw:mb-5">
          <Field label="Collection name" required error={errors.title}>
            <InputText value={title} onChange={(e) => setTitle(e.target.value)} className="tw:w-full" placeholder="e.g. Festive Edit" />
          </Field>
          <Field label="Slug" required error={errors.slug}>
            <InputText value={slug} onChange={(e) => setSlug(e.target.value)} className="tw:w-full" placeholder="e.g. festive-edit" />
          </Field>
          <Field label="Description">
            <InputTextarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="tw:w-full" />
          </Field>
          <Field label="Collection image">
            <label className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:border tw:border-dashed tw:border-[#E7E0CE] tw:rounded-lg tw:py-6 tw:cursor-pointer tw:text-[#9AA39B] tw:text-[12.5px] tw:hover:border-[#AD8A3F]">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="tw:h-24 tw:rounded-md tw:object-cover" />
              ) : (
                <i className="pi pi-upload tw:text-lg" />
              )}
              <span>{imagePreview ? "Click to replace" : "Click to upload collection image"}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="tw:hidden" />
            </label>
          </Field>
          <label className="tw:flex tw:items-center tw:gap-2.5">
            <InputSwitch checked={isActive} onChange={(e) => setIsActive(e.value)} />
            <span className="tw:text-[13px] tw:text-[#5E6D67]">Active</span>
          </label>
        </div>

        <div className="tw:flex tw:gap-2.5 tw:justify-end">
          <Button type="button" label="Cancel" outlined onClick={handleCancel} />
          <Button type="submit" label={editing ? "Save changes" : "Create collection"} icon="pi pi-check" loading={saving} />
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="tw:mb-4">
      <label className="tw:block tw:text-[12px] tw:text-[#5E6D67] tw:mb-1.5">
        {label} {required && <span className="tw:text-[#9C4E3A]">*</span>}
      </label>
      {children}
      {error && <div className="tw:text-[11.5px] tw:text-[#9C4E3A] tw:mt-1">{error}</div>}
    </div>
  );
}
