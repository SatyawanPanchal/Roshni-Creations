/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";

import { MapPin, Pencil, Trash2, Check, Plus } from "lucide-react";

import { useAddress } from "../../context/AddressContext.jsx";

const SavedAddresses = ({
  onAddAddress,
  onEditAddress,
  selectedAddressId,
  onSelectAddress,
  selectionMode = false,
}) => {
  const toast = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  const { addresses, loading, makeDefaultAddress, removeAddress } =
    useAddress();

  const showToast = (result, successMsg) => {
    toast.current?.show({
      severity: result.success ? "success" : "error",
      summary: result.success ? "Done" : "Error",
      detail: result.success ? successMsg : result.message,
      life: 3000,
    });
  };

  const handleSetDefault = async (id) => {
    showToast(await makeDefaultAddress(id), "Default address updated");
  };

  const handleDelete = async (id) => {
    setDeletingId(null);
    showToast(await removeAddress(id), "Address deleted");
  };

  if (loading) {
    return (
      <div className="tw:flex tw:flex-col tw:gap-4">
        <div className="tw:h-28 tw:animate-pulse tw:bg-gray-100" />
        <div className="tw:h-28 tw:animate-pulse tw:bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="tw:w-full">
      <Toast ref={toast} />

      {/* HEADER - only on profile page, not in checkout */}
      {!selectionMode && (
        <>
          <div className="tw:flex tw:flex-col tw:gap-4 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
            <div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-[#0C3F37]">
                Saved Addresses
              </h2>
              <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                Manage your saved delivery addresses.
              </p>
            </div>

            <Button
              label="Add Address"
              icon={<Plus size={16} />}
              onClick={onAddAddress}
              className="tw:!border-[#0C3F37] tw:!bg-[#0C3F37] tw:!px-4 tw:!py-2.5 tw:!text-sm tw:!font-medium tw:!text-white tw:!shadow-none"
            />
          </div>
          <Divider />
        </>
      )}

      <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:lg:grid-cols-2">
        {addresses.map((address) => {
          const isSelected = selectionMode && selectedAddressId === address._id;

          return (
            <div
              key={address._id}
              onClick={
                selectionMode ? () => onSelectAddress?.(address) : undefined
              }
              className={`tw:border tw:bg-white tw:p-4 ${
                selectionMode ? "tw:cursor-pointer" : ""
              } ${
                isSelected
                  ? "tw:border-[#0C3F37] tw:bg-[#E3F0EE]"
                  : "tw:border-gray-200"
              }`}
            >
              {/* TOP ROW */}
              <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                <div>
                  <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                    <h3 className="tw:text-sm tw:font-semibold tw:text-[#37252C]">
                      {address.firstName} {address.lastName}
                    </h3>

                    <Tag
                      value={address.addressType}
                      className="tw:!rounded-full tw:!bg-gray-100 tw:!px-2 tw:!py-0.5 tw:!text-xs tw:!font-medium tw:!text-gray-600"
                    />

                    {address.isDefault && (
                      <Tag
                        value="Default"
                        className="tw:!rounded-full tw:!bg-[#FFF5F8] tw:!px-2 tw:!py-0.5 tw:!text-xs tw:!font-medium tw:!text-[#0C3F37]"
                      />
                    )}
                  </div>

                  <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                    {address.phone}
                  </p>
                </div>

                {/* Selected check */}
                {isSelected && (
                  <Check size={20} className="tw:shrink-0 tw:text-[#0C3F37]" />
                )}
              </div>

              {/* ADDRESS */}
              <div className="tw:mt-3 tw:text-sm tw:leading-6 tw:text-gray-600">
                <p>
                  {address.flat}, {address.street}
                </p>
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                {address.landmark && (
                  <p className="tw:text-gray-500">
                    Landmark: {address.landmark}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div
                className="tw:mt-3 tw:flex tw:flex-wrap tw:items-center tw:gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {deletingId === address._id ? (
                  // INLINE DELETE CONFIRM
                  <>
                    <span className="tw:text-xs tw:text-gray-600">
                      Delete this address?
                    </span>
                    <Button
                      label="Yes"
                      text
                      onClick={() => handleDelete(address._id)}
                      className="tw:!px-2 tw:!py-1 tw:!text-xs tw:!text-red-500"
                    />
                    <Button
                      label="No"
                      text
                      onClick={() => setDeletingId(null)}
                      className="tw:!px-2 tw:!py-1 tw:!text-xs tw:!text-gray-600"
                    />
                  </>
                ) : (
                  <>
                    {/* Profile page only */}
                    {!selectionMode && !address.isDefault && (
                      <Button
                        label="Set as Default"
                        text
                        onClick={() => handleSetDefault(address._id)}
                        className="tw:!px-2 tw:!py-1 tw:!text-xs tw:!text-[#0C3F37]"
                      />
                    )}

                    {!selectionMode && (
                      <Button
                        label="Edit"
                        icon={<Pencil size={14} />}
                        text
                        onClick={() => onEditAddress?.(address)}
                        className="tw:!px-2 tw:!py-1 tw:!text-xs tw:!text-gray-600"
                      />
                    )}

                    <Button
                      label="Delete"
                      icon={<Trash2 size={14} />}
                      text
                      onClick={() => setDeletingId(address._id)}
                      className="tw:!px-2 tw:!py-1 tw:!text-xs tw:!text-red-500"
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* ADD CARD - checkout only (one single add button) */}
        {selectionMode && (
          <button
            type="button"
            onClick={onAddAddress}
            className="tw:flex tw:min-h-[140px] tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:border tw:border-dashed tw:border-gray-300 tw:bg-white tw:text-sm tw:font-medium tw:text-[#0C3F37] tw:cursor-pointer"
          >
            <Plus size={22} />
            Add new address
          </button>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;