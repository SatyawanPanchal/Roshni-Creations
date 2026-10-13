import { useRef } from "react";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

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

  const { addresses, loading, makeDefaultAddress, removeAddress } =
    useAddress();

  // --------------------------------------------------
  // SET DEFAULT
  // --------------------------------------------------

  const handleSetDefault = async (addressId) => {
    const result = await makeDefaultAddress(addressId);

    if (result.success) {
      toast.current?.show({
        severity: "success",
        summary: "Address Updated",
        detail: "Default address updated successfully",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: result.message,
        life: 3000,
      });
    }
  };

  // --------------------------------------------------
  // DELETE ADDRESS
  // --------------------------------------------------

  const handleDelete = (address) => {
    confirmDialog({
      message: "Are you sure you want to delete this address?",
      header: "Delete Address",
      icon: "pi pi-exclamation-triangle",

      acceptClassName: "tw:bg-[#0C3F37] tw:border-[#0C3F37]",

      accept: async () => {
        const result = await removeAddress(address._id);

        if (result.success) {
          toast.current?.show({
            severity: "success",
            summary: "Address Deleted",
            detail: "Address deleted successfully",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: result.message,
            life: 3000,
          });
        }
      },
    });
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="tw:flex tw:flex-col tw:gap-4">
        <div className="tw:h-28 tw:animate-pulse tw:bg-gray-100" />
        <div className="tw:h-28 tw:animate-pulse tw:bg-gray-100" />
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />

      <ConfirmDialog />

      <div className="tw:w-full">
        {/* HEADER */}
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

        {/* EMPTY STATE */}
        {addresses.length === 0 ? (
          <div className="tw:flex tw:min-h-[280px] tw:flex-col tw:items-center tw:justify-center tw:border tw:border-dashed tw:border-gray-300 tw:px-6 tw:text-center">
            <div className="tw:mb-4 tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#FFF5F8]">
              <MapPin size={25} className="tw:text-[#0C3F37]" />
            </div>

            <h3 className="tw:text-base tw:font-semibold tw:text-[#37252C]">
              No saved addresses
            </h3>

            <p className="tw:mt-1 tw:max-w-sm tw:text-sm tw:leading-relaxed tw:text-gray-500">
              Save your delivery address to make checkout faster and easier.
            </p>

            <Button
              label="Add Your First Address"
              icon={<Plus size={16} />}
              onClick={onAddAddress}
              text
              className="tw:mt-3 tw:!text-[#0C3F37]"
            />
          </div>
        ) : (
          /* ADDRESS LIST */
          <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:lg:grid-cols-2">
            {addresses.map((address) => (
              <Card
                key={address._id}
                onClick={
                  selectionMode
                    ? () => onSelectAddress?.(address)
                    : undefined
                }
                className={`tw:!rounded-none tw:!border tw:!shadow-none ${
                  selectionMode && selectedAddressId === address._id
                    ? "tw:!border-[#0C3F37]"
                    : "tw:!border-gray-200"
                }`}
              >
                {/* ADDRESS HEADER */}
                <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                  <div className="tw:flex tw:items-start tw:gap-3">
                    <div className="tw:flex tw:h-9 tw:w-9 tw:shrink-0 tw:items-center tw:justify-center tw:bg-[#FFF5F8]">
                      <MapPin
                        size={17}
                        className="tw:text-[#0C3F37]"
                      />
                    </div>

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
                            icon="pi pi-check"
                            className="tw:!rounded-full tw:!bg-[#FFF5F8] tw:!px-2 tw:!py-0.5 tw:!text-xs tw:!font-medium tw:!text-[#0C3F37]"
                          />
                        )}
                      </div>

                      <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                        {address.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <Divider className="tw:!my-4" />

                {/* ADDRESS */}
                <div className="tw:text-sm tw:leading-6 tw:text-gray-600">
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

                  <p>{address.country}</p>
                </div>

                {/* ACTIONS */}
                <div className="tw:mt-5 tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                  {!address.isDefault && (
                    <Button
                      label="Set as Default"
                      icon={<Check size={15} />}
                      text
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address._id);
                      }}
                      className="tw:!px-2 tw:!py-2 tw:!text-xs tw:!text-[#0C3F37]"
                    />
                  )}

                  {/* EDIT ONLY IN PROFILE */}
                  {!selectionMode && (
                    <Button
                      label="Edit"
                      icon={<Pencil size={15} />}
                      text
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAddress(address);
                      }}
                      className="tw:!px-2 tw:!py-2 tw:!text-xs tw:!text-gray-600"
                    />
                  )}

                  <Button
                    label="Delete"
                    icon={<Trash2 size={15} />}
                    text
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address);
                    }}
                    className="tw:!px-2 tw:!py-2 tw:!text-xs tw:!text-red-500"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedAddresses;