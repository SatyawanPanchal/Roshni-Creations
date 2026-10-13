import api from "./api.js";

// Get all saved addresses
const getAddresses = async () => {
  const response = await api.get("/addresses");

  return response.data;
};

// Get single address
const getAddress = async (addressId) => {
  const response = await api.get(`/addresses/${addressId}`);

  return response.data;
};

// Add new address
const addAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);

  return response.data;
};

// Update existing address
const updateAddress = async (addressId, addressData) => {
  const response = await api.put(
    `/addresses/${addressId}`,
    addressData
  );

  return response.data;
};

// Delete address
const deleteAddress = async (addressId) => {
  const response = await api.delete(
    `/addresses/${addressId}`
  );

  return response.data;
};

// Set address as default
const setDefaultAddress = async (addressId) => {
  const response = await api.patch(
    `/addresses/${addressId}/default`
  );

  return response.data;
};

export {
  getAddresses,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};