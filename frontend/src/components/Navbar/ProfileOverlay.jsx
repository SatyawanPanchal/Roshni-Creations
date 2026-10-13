import { useState } from "react";

import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";

import {
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

import SavedAddresses from "./SavedAddresses.jsx";
import AddressForm from "./AddressForm.jsx";

const ProfileOverlay = ({ isOpen, onClose, onLogin }) => {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");

  const [addressMode, setAddressMode] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState(null);

  // --------------------------------------------------
  // CLOSE OVERLAY
  // --------------------------------------------------

  const handleClose = () => {
    setActiveSection("profile");
    setAddressMode(null);
    setSelectedAddress(null);

    onClose?.();
  };

  // --------------------------------------------------
  // OPEN SAVED ADDRESSES
  // --------------------------------------------------

  const handleSavedAddresses = () => {
    setActiveSection("addresses");
    setAddressMode(null);
    setSelectedAddress(null);
  };

  // --------------------------------------------------
  // ADD ADDRESS
  // --------------------------------------------------

  const handleAddAddress = () => {
    setAddressMode("add");
    setSelectedAddress(null);
  };

  // --------------------------------------------------
  // EDIT ADDRESS
  // --------------------------------------------------

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setAddressMode("edit");
  };

  // --------------------------------------------------
  // ADDRESS SAVED
  // --------------------------------------------------

  const handleAddressSuccess = () => {
    setAddressMode(null);
    setSelectedAddress(null);
  };

  // --------------------------------------------------
  // BACK TO ADDRESSES
  // --------------------------------------------------

  const handleBackToAddresses = () => {
    setAddressMode(null);
    setSelectedAddress(null);
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  return (
    <>
      {isOpen && (
        <div className="tw:fixed tw:inset-0 tw:z-[100]">
          {/* BACKDROP */}
          <div
            className="tw:absolute tw:inset-0 tw:bg-black/30"
            onClick={handleClose}
          />

          {/* PANEL */}
          <div className="tw:absolute tw:right-0 tw:top-0 tw:h-full tw:w-full tw:max-w-md tw:overflow-y-auto tw:bg-white tw:shadow-2xl">
            {/* --------------------------------------------------
            PROFILE MAIN
        -------------------------------------------------- */}

            {activeSection === "profile" && (
              <>
                {/* HEADER */}
                <div className="tw:flex tw:items-center tw:justify-between tw:border-b tw:border-gray-200 tw:px-6 tw:py-5">
                  <h2 className="tw:text-lg tw:font-semibold tw:text-[#37252C]">
                    My Account
                  </h2>

                  <Button
                    icon="pi pi-times"
                    text
                    rounded
                    onClick={handleClose}
                    aria-label="Close"
                  />
                </div>

                {/* USER INFO */}
                <div className="tw:px-6 tw:py-8">
                  {user ? (
                    <div className="tw:flex tw:items-center tw:gap-4">
                      <Avatar
                        label={user?.firstName?.charAt(0)?.toUpperCase()}
                        shape="circle"
                        size="large"
                        className="tw:!bg-[#FFF5F8] tw:!text-[#C2185B]"
                      />

                      <div className="tw:min-w-0">
                        <h3 className="tw:text-base tw:font-semibold tw:text-[#37252C]">
                          {user?.firstName} {user?.lastName}
                        </h3>

                        <p className="tw:mt-1 tw:truncate tw:text-sm tw:text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="tw:text-center">
                      <p className="tw:text-sm tw:text-gray-500">
                        Please login to access your account
                      </p>

                      <button
                        type="button"
                        className="tw:mt-2 tw:text-sm tw:font-medium tw:text-[#C2185B] tw:hover:underline tw:cursor-pointer"
                        onClick={onLogin}
                      >
                        Login / Sign Up
                      </button>
                    </div>
                  )}
                </div>

                <Divider className="tw:!my-0" />

                {/* MENU */}
                <div className="tw:px-4 tw:py-4">
                  {/* MY PROFILE */}
                  <button
                    type="button"
                    className="tw:flex tw:w-full tw:items-center tw:gap-4 tw:px-3 tw:py-4 tw:text-left tw:transition-colors tw:hover:bg-[#FFF5F8]"
                  >
                    <User size={19} className="tw:text-[#C2185B]" />

                    <div className="tw:flex-1">
                      <p className="tw:text-sm tw:font-medium tw:text-[#37252C]">
                        My Profile
                      </p>

                      <p className="tw:mt-0.5 tw:text-xs tw:text-gray-500">
                        Manage your account details
                      </p>
                    </div>

                    <ChevronRight size={17} className="tw:text-gray-400" />
                  </button>

                  {/* SAVED ADDRESSES */}
                  <button
                    type="button"
                    onClick={handleSavedAddresses}
                    className="tw:flex tw:w-full tw:items-center tw:gap-4 tw:px-3 tw:py-4 tw:text-left tw:transition-colors tw:hover:bg-[#FFF5F8]"
                  >
                    <MapPin size={19} className="tw:text-[#C2185B]" />

                    <div className="tw:flex-1">
                      <p className="tw:text-sm tw:font-medium tw:text-[#37252C]">
                        Saved Addresses
                      </p>

                      <p className="tw:mt-0.5 tw:text-xs tw:text-gray-500">
                        Manage your delivery addresses
                      </p>
                    </div>

                    <ChevronRight size={17} className="tw:text-gray-400" />
                  </button>

                  {/* ORDERS */}
                  <button
                    type="button"
                    className="tw:flex tw:w-full tw:items-center tw:gap-4 tw:px-3 tw:py-4 tw:text-left tw:transition-colors tw:hover:bg-[#FFF5F8]"
                  >
                    <Package size={19} className="tw:text-[#C2185B]" />

                    <div className="tw:flex-1">
                      <p className="tw:text-sm tw:font-medium tw:text-[#37252C]">
                        My Orders
                      </p>

                      <p className="tw:mt-0.5 tw:text-xs tw:text-gray-500">
                        View your orders and their status
                      </p>
                    </div>

                    <ChevronRight size={17} className="tw:text-gray-400" />
                  </button>

                  {/* WISHLIST */}
                  <button
                    type="button"
                    className="tw:flex tw:w-full tw:items-center tw:gap-4 tw:px-3 tw:py-4 tw:text-left tw:transition-colors tw:hover:bg-[#FFF5F8]"
                  >
                    <Heart size={19} className="tw:text-[#C2185B]" />

                    <div className="tw:flex-1">
                      <p className="tw:text-sm tw:font-medium tw:text-[#37252C]">
                        Wishlist
                      </p>

                      <p className="tw:mt-0.5 tw:text-xs tw:text-gray-500">
                        View your favourite jewellery
                      </p>
                    </div>

                    <ChevronRight size={17} className="tw:text-gray-400" />
                  </button>
                </div>

                <Divider className="tw:!my-0" />

                {/* LOGOUT */}
                <div className="tw:px-4 tw:py-4">
                  <Button
                    label="Logout"
                    icon={<LogOut size={17} />}
                    text
                    onClick={handleLogout}
                    className="tw:w-full tw:!justify-start tw:!px-3 tw:!py-3 tw:!text-red-500"
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------------
            SAVED ADDRESSES
        -------------------------------------------------- */}

            {activeSection === "addresses" && (
              <div className="tw:min-h-full tw:px-5 tw:py-5 tw:sm:px-6">
                {/* HEADER */}
                <div className="tw:mb-6 tw:flex tw:items-center tw:gap-3">
                  <Button
                    icon={<ArrowLeft size={18} />}
                    text
                    rounded
                    onClick={() => {
                      if (addressMode) {
                        handleBackToAddresses();
                      } else {
                        setActiveSection("profile");
                      }
                    }}
                    aria-label="Back"
                    className="tw:!h-9 tw:!w-9 tw:!p-0"
                  />

                  <div>
                    <h2 className="tw:text-lg tw:font-semibold tw:text-[#37252C]">
                      {addressMode === "add"
                        ? "Add Address"
                        : addressMode === "edit"
                          ? "Edit Address"
                          : "Saved Addresses"}
                    </h2>

                    <p className="tw:mt-0.5 tw:text-xs tw:text-gray-500">
                      {addressMode
                        ? "Enter your delivery details"
                        : "Manage your delivery addresses"}
                    </p>
                  </div>
                </div>

                {/* ADDRESS FORM */}
                {addressMode ? (
                  <AddressForm
                    address={addressMode === "edit" ? selectedAddress : null}
                    onSuccess={handleAddressSuccess}
                    onCancel={handleBackToAddresses}
                  />
                ) : (
                  /* SAVED ADDRESS LIST */
                  <SavedAddresses
                    onAddAddress={handleAddAddress}
                    onEditAddress={handleEditAddress}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
    </>
  );
};

export default ProfileOverlay;
