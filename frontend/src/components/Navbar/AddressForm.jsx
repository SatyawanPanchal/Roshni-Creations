/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { X } from "lucide-react";

import { useAddress } from "../../context/AddressContext.jsx";

const AddressForm = ({
  address = null,
  onSuccess,
  onCancel,
}) => {
  const { createAddress, editAddress } = useAddress();

  const isEditMode = Boolean(address);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "India",
    flat: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    addressType: "Home",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const addressTypes = [
    {
      label: "Home",
      value: "Home",
    },
    {
      label: "Work",
      value: "Work",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  // --------------------------------------------------
  // LOAD ADDRESS FOR EDIT
  // --------------------------------------------------

  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        phone: address.phone || "",
        country: address.country || "India",
        flat: address.flat || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        landmark: address.landmark || "",
        addressType: address.addressType || "Home",
        isDefault: Boolean(address.isDefault),
      });
    }
  }, [address]);

  // --------------------------------------------------
  // HANDLE INPUT
  // --------------------------------------------------

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts correcting it
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName =
        "First name must contain at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName =
        "Last name must contain at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number";
    }

    if (!formData.flat.trim()) {
      newErrors.flat =
        "House / flat / building details are required";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street / area is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required";
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        flat: formData.flat.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        landmark: formData.landmark.trim(),
        addressType: formData.addressType,
        isDefault: formData.isDefault,
      };

      let result;

      if (isEditMode) {
        result = await editAddress(
          address._id,
          payload
        );
      } else {
        result = await createAddress(payload);
      }

      if (result.success) {
        onSuccess?.(result.address);
      }
    } catch (error) {
      console.error("Address Form Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // INPUT CLASS
  // --------------------------------------------------

  const inputClass = (field) =>
    `tw:w-full ${
      errors[field]
        ? "tw:!border-red-500"
        : ""
    }`;

  return (
    <div className="tw:w-full">
      {/* HEADER */}
      <div className="tw:mb-6 tw:flex tw:items-start tw:justify-between tw:gap-4">
        <div>
          <h2 className="tw:text-xl tw:font-semibold tw:text-[#37252C]">
            {isEditMode
              ? "Edit Address"
              : "Add New Address"}
          </h2>

          <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
            {isEditMode
              ? "Update your delivery address details."
              : "Add an address for faster checkout."}
          </p>
        </div>

        {onCancel && (
          <Button
            icon={<X size={18} />}
            text
            onClick={onCancel}
            aria-label="Close"
            className="tw:!h-9 tw:!w-9 tw:!p-0 tw:!text-gray-500"
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="tw:flex tw:flex-col tw:gap-5"
      >
        {/* NAME */}
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              First Name
            </label>

            <InputText
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                handleChange(
                  "firstName",
                  e.target.value
                )
              }
              placeholder="Enter first name"
              className={inputClass("firstName")}
            />

            {errors.firstName && (
              <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                {errors.firstName}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              Last Name
            </label>

            <InputText
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                handleChange(
                  "lastName",
                  e.target.value
                )
              }
              placeholder="Enter last name"
              className={inputClass("lastName")}
            />

            {errors.lastName && (
              <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                {errors.lastName}
              </small>
            )}
          </div>
        </div>

        {/* PHONE + ADDRESS TYPE */}
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              Mobile Number
            </label>

            <InputText
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              placeholder="10-digit mobile number"
              keyfilter="int"
              maxLength={10}
              className={inputClass("phone")}
            />

            {errors.phone && (
              <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                {errors.phone}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="addressType"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              Address Type
            </label>

            <Dropdown
              id="addressType"
              value={formData.addressType}
              options={addressTypes}
              onChange={(e) =>
                handleChange(
                  "addressType",
                  e.value
                )
              }
              className="tw:w-full"
              placeholder="Select address type"
            />
          </div>
        </div>

        {/* COUNTRY */}
        <div>
          <label
            htmlFor="country"
            className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
          >
            Country
          </label>

          <InputText
            id="country"
            value={formData.country}
            disabled
            className="tw:w-full"
          />
        </div>

        {/* FLAT */}
        <div>
          <label
            htmlFor="flat"
            className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
          >
            Flat / House / Building
          </label>

          <InputText
            id="flat"
            value={formData.flat}
            onChange={(e) =>
              handleChange("flat", e.target.value)
            }
            placeholder="House no., flat, building name"
            className={inputClass("flat")}
          />

          {errors.flat && (
            <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
              {errors.flat}
            </small>
          )}
        </div>

        {/* STREET */}
        <div>
          <label
            htmlFor="street"
            className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
          >
            Street / Area
          </label>

          <InputText
            id="street"
            value={formData.street}
            onChange={(e) =>
              handleChange("street", e.target.value)
            }
            placeholder="Street, locality, area"
            className={inputClass("street")}
          />

          {errors.street && (
            <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
              {errors.street}
            </small>
          )}
        </div>

        {/* CITY / STATE / PIN */}
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:hover:grid-cols-3">
          <div>
            <label
              htmlFor="city"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              City
            </label>

            <InputText
              id="city"
              value={formData.city}
              onChange={(e) =>
                handleChange("city", e.target.value)
              }
              placeholder="City"
              className={inputClass("city")}
            />

            {errors.city && (
              <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                {errors.city}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              State
            </label>

            <InputText
              id="state"
              value={formData.state}
              onChange={(e) =>
                handleChange("state", e.target.value)
              }
              placeholder="State"
              className={inputClass("state")}
            />

            {errors.state && (
              <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                {errors.state}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="pincode"
              className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              PIN Code
            </label>

            <InputText
              id="pincode"
              value={formData.pincode}
              onChange={(e) =>
                handleChange(
                  "pincode",
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="6-digit PIN"
              keyfilter="int"
              maxLength={6}
              className={inputClass("pincode")}
            />

            {errors.pincode && (
              <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                {errors.pincode}
              </small>
            )}
          </div>
        </div>

        {/* LANDMARK */}
        <div>
          <label
            htmlFor="landmark"
            className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
          >
            Landmark
            <span className="tw:ml-1 tw:font-normal tw:text-gray-400">
              (Optional)
            </span>
          </label>

          <InputText
            id="landmark"
            value={formData.landmark}
            onChange={(e) =>
              handleChange(
                "landmark",
                e.target.value
              )
            }
            placeholder="Nearby landmark"
            className="tw:w-full"
          />
        </div>

        {/* DEFAULT ADDRESS */}
        <div className="tw:flex tw:items-start tw:gap-3 tw:border tw:border-gray-200 tw:bg-[#FFF9FB] tw:p-4">
          <input
            id="isDefault"
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) =>
              handleChange(
                "isDefault",
                e.target.checked
              )
            }
            className="tw:mt-1 tw:h-4 tw:w-4 tw:accent-[#C2185B]"
          />

          <div>
            <label
              htmlFor="isDefault"
              className="tw:cursor-pointer tw:text-sm tw:font-medium tw:text-[#37252C]"
            >
              Make this my default address
            </label>

            <p className="tw:mt-1 tw:text-xs tw:text-gray-500">
              This address will be selected automatically
              during checkout.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="tw:flex tw:flex-col-reverse tw:gap-3 tw:border-t tw:border-gray-200 tw:pt-5 tw:sm:flex-row tw:sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              label="Cancel"
              onClick={onCancel}
              disabled={submitting}
              outlined
              className="tw:!border-gray-300 tw:!text-gray-600 tw:shadow-none"
            />
          )}

          <Button
            type="submit"
            label={
              submitting
                ? "Saving..."
                : isEditMode
                  ? "Update Address"
                  : "Save Address"
            }
            loading={submitting}
            className="tw:!border-[#C2185B] tw:!bg-[#C2185B] tw:!text-white tw:shadow-none"
          />
        </div>
      </form>
    </div>
  );
};

export default AddressForm;