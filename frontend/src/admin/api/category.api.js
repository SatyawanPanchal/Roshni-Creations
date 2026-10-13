import api from "./axiosClient.js";

// GET /categories/admin -> { success, count, data: Category[] }
export async function getAllCategoriesAdmin() {
  const { data } = await api.get("/categories/admin");
  return data.data;
}

// GET /categories/getCategories -> only isActive: true categories
export async function getActiveCategories() {
  const { data } = await api.get("/categories/getCategories");
  return data.data;
}

// GET /categories/:id
export async function getCategoryById(id) {
  const { data } = await api.get(`/categories/${id}`);
  return data.data;
}

// POST /categories  (multipart/form-data)
// fields: title, category (slug), menuGroup, menuOrder, isActive, heroImg (file)
export async function createCategory(payload) {
  const fd = buildCategoryFormData(payload);
  const { data } = await api.post("/categories", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// PUT /categories/:id (multipart/form-data, all fields optional)
export async function updateCategory(id, payload) {
  const fd = buildCategoryFormData(payload);
  const { data } = await api.put(`/categories/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// DELETE /categories/:id
export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}

function buildCategoryFormData({ title, slug, menuGroup, menuOrder, isActive, heroImgFile }) {
  const fd = new FormData();
  if (title !== undefined) fd.append("title", title);
  // NOTE: the backend's unique slug-like field is literally named "category"
  if (slug !== undefined) fd.append("category", slug);
  if (menuGroup !== undefined) fd.append("menuGroup", menuGroup);
  if (menuOrder !== undefined) fd.append("menuOrder", menuOrder);
  if (isActive !== undefined) fd.append("isActive", isActive);
  if (heroImgFile) fd.append("heroImg", heroImgFile);
  return fd;
}
