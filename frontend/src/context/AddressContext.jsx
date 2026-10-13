/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService.js";

import { useAuth } from "./AuthContext.jsx";

const AddressContext = createContext(null);

export const AddressProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET ADDRESSES
  // --------------------------------------------------

  const fetchAddresses = async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAddresses();

      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Fetch Addresses Error:", error);

      setError(
        error.response?.data?.message || "Unable to load saved addresses",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // ADD ADDRESS
  // --------------------------------------------------

  const createAddress = async (addressData) => {
    try {
      setError("");

      const data = await addAddress(addressData);

      if (data.address) {
        setAddresses((prev) => {
          // If newly added address is default,
          // remove default status from existing addresses
          const updatedAddresses = prev.map((address) => ({
            ...address,
            isDefault: data.address.isDefault ? false : address.isDefault,
          }));

          return [...updatedAddresses, data.address].sort(
            (a, b) => Number(b.isDefault) - Number(a.isDefault),
          );
        });
      }

      return {
        success: true,
        address: data.address,
        message: data.message,
      };
    } catch (error) {
      console.error("Add Address Error:", error);

      const message = error.response?.data?.message || "Unable to add address";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // --------------------------------------------------
  // UPDATE ADDRESS
  // --------------------------------------------------

  const editAddress = async (addressId, addressData) => {
    try {
      setError("");

      const data = await updateAddress(addressId, addressData);

      if (data.address) {
        setAddresses((prev) => {
          let updatedAddresses = prev.map((address) =>
            address._id === addressId ? data.address : address,
          );

          // If updated address became default,
          // remove default from all others
          if (data.address.isDefault) {
            updatedAddresses = updatedAddresses.map((address) => ({
              ...address,
              isDefault: address._id === addressId,
            }));
          }

          return updatedAddresses.sort(
            (a, b) => Number(b.isDefault) - Number(a.isDefault),
          );
        });
      }

      return {
        success: true,
        address: data.address,
        message: data.message,
      };
    } catch (error) {
      console.error("Update Address Error:", error);

      const message =
        error.response?.data?.message || "Unable to update address";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // --------------------------------------------------
  // DELETE ADDRESS
  // --------------------------------------------------

  const removeAddress = async (addressId) => {
    try {
      setError("");

      const data = await deleteAddress(addressId);

      setAddresses((prev) => {
        const deletedAddress = prev.find(
          (address) => address._id === addressId,
        );

        let updatedAddresses = prev.filter(
          (address) => address._id !== addressId,
        );

        // Backend automatically promotes another address
        // if the deleted address was default.
        if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
          const newestAddress = [...updatedAddresses].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )[0];

          updatedAddresses = updatedAddresses.map((address) => ({
            ...address,
            isDefault: address._id === newestAddress._id,
          }));
        }

        return updatedAddresses.sort(
          (a, b) => Number(b.isDefault) - Number(a.isDefault),
        );
      });

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error("Delete Address Error:", error);

      const message =
        error.response?.data?.message || "Unable to delete address";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // --------------------------------------------------
  // SET DEFAULT ADDRESS
  // --------------------------------------------------

  const makeDefaultAddress = async (addressId) => {
    try {
      setError("");

      const data = await setDefaultAddress(addressId);

      setAddresses((prev) =>
        prev
          .map((address) => ({
            ...address,
            isDefault: address._id === addressId,
          }))
          .sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
      );

      return {
        success: true,
        address: data.address,
        message: data.message,
      };
    } catch (error) {
      console.error("Set Default Address Error:", error);

      const message =
        error.response?.data?.message || "Unable to update default address";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // --------------------------------------------------
  // GET DEFAULT ADDRESS
  // --------------------------------------------------

  const defaultAddress = addresses.find((address) => address.isDefault) || null;

  // --------------------------------------------------
  // LOAD ADDRESSES WHEN USER LOGS IN
  // --------------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    } else {
      setAddresses([]);
      setError("");
    }
  }, [isAuthenticated]);

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = {
    addresses,
    defaultAddress,
    loading,
    error,

    fetchAddresses,
    createAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

// --------------------------------------------------
// CUSTOM HOOK
// --------------------------------------------------

export const useAddress = () => {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error("useAddress must be used inside AddressProvider");
  }

  return context;
};
