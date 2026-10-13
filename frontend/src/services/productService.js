import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/product/getProducts");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(
    `/product/getProduct/${id}`,
  );

  return response.data;
};

export const getProductsByCategory = async (
  category,
) => {
  const response = await api.get(
    `/product/getProductByCategory/${encodeURIComponent(category)}`,
  );

  return response.data;
};

export const getProductsByCollection = async (
  collection,
) => {
  const response = await api.get(
    `/product/getProductByCollection/${encodeURIComponent(collection)}`,
  );

  return response.data;
};

export const searchProducts = async (query) => {
  const response = await api.get(
    `/product/search?query=${encodeURIComponent(query)}`,
  );

  return response.data;
};