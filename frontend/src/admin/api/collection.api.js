import api from "./axiosClient.js";

// GET /collections/getCollections -> all collections
export async function getAllCollections() {
  const { data } = await api.get("/collections/getCollections");
  return data.data;
}

// GET /collections/getActiveCollections -> isActive: true only
export async function getActiveCollections() {
  const { data } = await api.get("/collections/getActiveCollections");
  return data.data;
}

// GET /collections/getCollection/:id
export async function getCollectionById(id) {
  const { data } = await api.get(`/collections/getCollection/${id}`);
  return data.data;
}

// POST /collections/addCollection (multipart/form-data, admin only)
export async function createCollection(payload) {
  const fd = buildCollectionFormData(payload);
  const { data } = await api.post("/collections/addCollection", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// PUT /collections/updateCollection/:id (multipart/form-data, admin only)
export async function updateCollection(id, payload) {
  const fd = buildCollectionFormData(payload);
  const { data } = await api.put(`/collections/updateCollection/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// DELETE /collections/deleteCollection/:id (admin only)
export async function deleteCollection(id) {
  const { data } = await api.delete(`/collections/deleteCollection/${id}`);
  return data;
}

function buildCollectionFormData({ title, slug, description, isActive, imageFile }) {
  const fd = new FormData();
  if (title !== undefined) fd.append("title", title);
  if (slug !== undefined) fd.append("slug", slug);
  if (description !== undefined) fd.append("description", description);
  if (isActive !== undefined) fd.append("isActive", isActive);
  if (imageFile) fd.append("image", imageFile);
  return fd;
}
