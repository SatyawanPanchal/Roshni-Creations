/* eslint-disable no-undef */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  LockKeyhole,
  CreditCard,
  Check,
  Plus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { useAddress } from "../../context/AddressContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

import api from "../../services/api.js";

import LoginSignupOverlay from "./LoginSignupOverlay.jsx";
import SavedAddresses from "../Navbar/SavedAddresses.jsx";
import AddressForm from "../Navbar/AddressForm.jsx";

const ACCENT_BUTTON_CLASS =
  "tw:!border-[#0C3F37] tw:!bg-[#0C3F37] tw:!text-white tw:shadow-none";

const CheckoutSection = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const { user, isAuthenticated } = useAuth();

  const { addresses, loading: addressLoading } = useAddress();

  const { cartItems, subtotal, shipping, total, clearCart } = useCart();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const [updates, setUpdates] = useState(true);

  const [showLogin, setShowLogin] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [errors, setErrors] = useState({});

  const [isProcessing, setIsProcessing] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(
    () => localStorage.getItem("exhibition_coupon") || "",
  );

  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  // Coupon applied → no shipping charge
  const effectiveShipping = discount > 0 ? 0 : Number(shipping || 0);
  const finalTotal = subtotal + effectiveShipping - discount;

  // --------------------------------------------------
  // AUTO SELECT DEFAULT ADDRESS
  // --------------------------------------------------

  useEffect(() => {
    if (!isAuthenticated || !addresses?.length) {
      setSelectedAddressId(null);
      return;
    }

    const defaultAddress =
      addresses.find((address) => address.isDefault) || addresses[0];

    if (!defaultAddress) return;

    setSelectedAddressId(defaultAddress._id);
  }, [isAuthenticated, addresses]);

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  const formatINR = (value = 0) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  // --------------------------------------------------
  // SELECT ADDRESS
  // --------------------------------------------------
  const handleSelectAddress = (address) => {
    if (!address?._id) return;
    setSelectedAddressId(address._id);
    setErrors((prev) => ({ ...prev, address: "" }));
  };

  // --------------------------------------------------
  // ADD ADDRESS
  // --------------------------------------------------

  const handleAddAddress = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    setShowAddressForm(true);
  };

  // --------------------------------------------------
  // ADDRESS CREATED
  // --------------------------------------------------

  const handleAddressSuccess = (address) => {
    setShowAddressForm(false);

    if (address?._id) {
      setSelectedAddressId(address._id);

      setErrors((prev) => ({
        ...prev,
        address: "",
      }));
    }

    toast.current?.show({
      severity: "success",
      summary: "Address Saved",
      detail: "Your delivery address has been saved.",
      life: 3000,
    });
  };

  // --------------------------------------------------
  // ADDRESS FORM CANCEL
  // --------------------------------------------------

  const handleAddressCancel = () => {
    setShowAddressForm(false);
  };

  // --------------------------------------------------
  // VALIDATE CHECKOUT
  // --------------------------------------------------

  const validateCheckout = () => {
    const newErrors = {};

    if (!isAuthenticated) {
      newErrors.auth = "Please login to continue.";
    }

    if (!user?.email) {
      newErrors.email = "Email address is required.";
    }

    if (!user?.phone) {
      newErrors.phone = "Phone number is required.";
    }

    const selectedAddress = addresses?.find(
      (address) => address._id === selectedAddressId,
    );

    if (!selectedAddress) {
      newErrors.address = "Please select a delivery address.";
    }

    if (paymentMethod !== "ONLINE") {
      newErrors.payment = "Please select online payment.";
    }

    if (!cartItems?.length) {
      newErrors.cart = "Your cart is empty.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // COMPLETE ORDER
  // --------------------------------------------------

  async function paymentIntegration() {
    console.log("Clicked");
    try {
      // console.log("form data here", formData);
      const response = await api.post("/order/create-order", {
        couponCode: appliedCoupon,
      });

      console.log(response);

      if (!response?.data?.order?.id) {
        throw new Error(response?.data?.message || "Order creation failed");
      }

      //////////////////////////////////////

      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.order.amount,
        currency: "INR",
        name: "Roshni Creations",
        order_id: response.data.order.id, //obtained from order creation at backend by api request
        retry: {
          enabled: false, // disables the built-in retry screen
        },
        handler: async function ({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }) {
          try {
            // sending to server for verification
            const verifyRes = await api.post("/order/verify-payment", {
              razorpay_order_id: razorpay_order_id,
              razorpay_payment_id: razorpay_payment_id,
              razorpay_signature: razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.current.show({
                severity: "success",
                summary: "Payment Verified",
                life: 3000,
              });
              try {
                const isPaymentTrue = true;
                await orderCreation(isPaymentTrue);
              } catch (error) {
                toast.current.show({
                  severity: "error",
                  summary: "Payment succeeded, but order update failed",
                  detail:
                    "Please contact support with your payment ID: " +
                    razorpay_payment_id,
                  life: 5000,
                });
              }
            } else {
              toast.current.show({
                severity: "error",
                summary: "Verification Failed",
                life: 3000,
              });
            }
          } catch (error) {
            toast.current.show({
              severity: "error",
              summary: "Verification failed",
              life: 3000,
            });
          }
        },
        // prefill field for user information
        prefill: {
          name: user.firstName,
          contact: user.phone,
        },
      };

      const rzp1 = new Razorpay(razorpayOptions);

      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        rzp1.close();
        navigate("/"); //failure page
      });

      rzp1.open();
    } catch (error) {
      console.log(error);
      return toast.current.show({
        severity: "error",
        summary: "Something went wrong",
        detail: error?.response?.data.message,
        life: 3000,
      });
    }
  }

  const handleCompleteOrder = async () => {
    // ----------------------------------------------
    // CART CHECK
    // ----------------------------------------------

    if (!cartItems?.length) {
      toast.current?.show({
        severity: "warn",
        summary: "Cart Empty",
        detail: "Your cart is empty. Add some jewellery before checkout.",
        life: 3000,
      });

      return;
    }

    // ----------------------------------------------
    // LOGIN CHECK
    // ----------------------------------------------

    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    const isValid = validateCheckout();

    if (!isValid) {
      toast.current?.show({
        severity: "warn",
        summary: "Incomplete Checkout",
        detail: "Please complete the required checkout details.",
        life: 3000,
      });

      return;
    }

    await paymentIntegration();
  };

  const orderCreation = async (isPaymentTrue) => {
    try {
      setIsProcessing(true);

      // --------------------------------------------
      // BACKEND ORDER PAYLOAD
      // --------------------------------------------

      const payload = {
        addressId: selectedAddressId,
        paymentMethod: "ONLINE",
        paymentStatus: isPaymentTrue && "Paid",
        couponCode: appliedCoupon,
      };

      // --------------------------------------------
      // CREATE ORDER
      // --------------------------------------------

      const response = await api.post("/order/create", payload);

      const createdOrder = response?.data?.order;

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to create order");
      }

      // --------------------------------------------
      // SYNC FRONTEND CART
      // Backend already clears the cart.
      // This keeps CartContext in sync.
      // --------------------------------------------

      try {
        await clearCart();
      } catch (cartError) {
        console.warn("Cart sync after order failed:", cartError);
      }

      // --------------------------------------------
      // ORDER CONFIRMATION
      // --------------------------------------------

      localStorage.setItem("roshni_last_order", JSON.stringify(createdOrder));

      localStorage.removeItem("exhibition_coupon");

      navigate("/orderConfirmed", {
        state: {
          order: createdOrder,
        },
      });
    } catch (error) {
      console.error("Complete order error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to place your order. Please try again.";

      toast.current?.show({
        severity: "error",
        summary: "Order Failed",
        detail: message,
        life: 4000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // --------------------------------------------------
  // SELECTED ADDRESS
  // --------------------------------------------------

  const selectedAddress = addresses?.find(
    (address) => address._id === selectedAddressId,
  );

  // --------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------

  if (!cartItems?.length) {
    return (
      <section className="tw:w-full tw:bg-[#faf7f1]">
        <Toast ref={toast} />

        <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:py-12 tw:sm:px-6 tw:lg:px-8">
          <div className="tw:border tw:border-gray-200 tw:bg-white tw:px-6 tw:py-14 tw:text-center">
            <h2 className="tw:text-xl tw:font-semibold tw:text-[#37252C]">
              Your cart is empty
            </h2>

            <p className="tw:mt-2 tw:text-sm tw:text-gray-500">
              Add some beautiful pieces to your cart before continuing to
              checkout.
            </p>

            <Button
              label="Continue Shopping"
              onClick={() => navigate("/products")}
              className={`tw:mt-6 ${ACCENT_BUTTON_CLASS}`}
            />
          </div>
        </div>
      </section>
    );
  }

  const handleApplyCoupon = async () => {
    try {
      const res = await api.post("/order/apply-coupon", {
        couponCode: couponInput,
      });
      if (res.data.success) {
        setAppliedCoupon(couponInput.trim().toUpperCase());
        toast.current?.show({
          severity: "success",
          summary: "Coupon applied",
          life: 3000,
        });
      } else {
        setAppliedCoupon("");
        toast.current?.show({
          severity: "error",
          summary: res.data.message,
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Could not apply coupon",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <section className="tw:w-full tw:bg-[#faf7f1]">
        <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:sm:py-10 tw:lg:px-8">
          {/* =================================================
                PAGE HEADER
            ================================================= */}

          {/* =================================================
                MAIN GRID
            ================================================= */}

          <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* =================================================
                  LEFT COLUMN
              ================================================= */}

            <div className="tw:flex tw:flex-col tw:gap-6">
              {/* =================================================
                    CONTACT INFORMATION
                ================================================= */}

              <div className="tw:border tw:border-gray-200 tw:bg-white tw:p-5 tw:sm:p-6">
                <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
                  <div>
                    <h2 className="tw:text-lg tw:font-semibold tw:text-[#37252C]">
                      Contact Information
                    </h2>

                    {/* <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                      Your contact information is taken from your account.
                    </p> */}
                  </div>

                  <ShieldCheck
                    size={21}
                    className="tw:shrink-0 tw:text-[#0C3F37]"
                  />
                </div>

                <Divider />

                {isAuthenticated && (
                  <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="checkout-email"
                        className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
                      >
                        Email Address
                      </label>

                      <span className="tw:relative tw:block">
                        <Mail
                          size={17}
                          className="tw:absolute tw:left-3 tw:top-1/2 tw:z-10 tw:-translate-y-1/2 tw:text-gray-400"
                        />

                        <InputText
                          id="checkout-email"
                          value={user?.email || ""}
                          readOnly
                          className="tw:w-full tw:!pl-10 tw:bg-gray-50"
                        />
                      </span>

                      {errors.email && (
                        <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                          {errors.email}
                        </small>
                      )}
                    </div>

                    {/* PHONE */}

                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-[#37252C]"
                      >
                        Mobile Number
                      </label>

                      <span className="tw:relative tw:block">
                        <Phone
                          size={17}
                          className="tw:absolute tw:left-3 tw:top-1/2 tw:z-10 tw:-translate-y-1/2 tw:text-gray-400"
                        />

                        <InputText
                          id="checkout-phone"
                          value={user?.phone || ""}
                          readOnly
                          className="tw:w-full tw:!pl-10 tw:bg-gray-50"
                        />
                      </span>

                      {errors.phone && (
                        <small className="tw:mt-1 tw:block tw:text-xs tw:text-red-500">
                          {errors.phone}
                        </small>
                      )}
                    </div>
                  </div>
                )}

                {!isAuthenticated && (
                  <div
                    onClick={() => setShowLogin(true)}
                    className="tw:mt-4 tw:border tw:border-[#0C3F37] tw:bg-[#EFF4F3] tw:p-4 tw:cursor-pointer"
                  >
                    <p className="tw:text-sm tw:text-[#37252C]">
                      Please login to continue for checkout.
                    </p>

                    <Button
                      label="Login"
                      onClick={() => setShowLogin(true)}
                      text
                      className="tw:!mt-1 tw:!px-0 tw:!text-[#0C3F37]"
                    />
                  </div>
                )}

                {/* OPTIONAL MARKETING UPDATES */}

                <div className="tw:mt-5 tw:flex tw:items-start tw:gap-3">
                  <Checkbox
                    inputId="checkout-updates"
                    checked={updates}
                    onChange={(e) => setUpdates(e.checked)}
                  />

                  <label
                    htmlFor="checkout-updates"
                    className="tw:cursor-pointer tw:text-sm tw:text-gray-600"
                  >
                    Keep me updated about new jewellery, offers and collections.
                  </label>
                </div>
              </div>

              {/* =================================================
                    DELIVERY ADDRESS
                ================================================= */}

              {/* DELIVERY ADDRESS */}
              <div className="tw:border tw:border-gray-200 tw:bg-white tw:p-5 tw:sm:p-6">
                <h2 className="tw:text-lg tw:font-semibold tw:text-[#37252C]">
                  Delivery Address
                </h2>

                <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                  Select where you want your order delivered.
                </p>

                <Divider />

                {errors.address && (
                  <div className="tw:mb-4 tw:border tw:border-red-200 tw:bg-red-50 tw:px-4 tw:py-3">
                    <p className="tw:text-sm tw:text-red-600">
                      {errors.address}
                    </p>
                  </div>
                )}

                {addressLoading ? (
                  <div className="tw:h-40 tw:animate-pulse tw:bg-gray-100" />
                ) : addresses?.length ? (
                  <SavedAddresses
                    selectionMode
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={handleSelectAddress}
                    onAddAddress={handleAddAddress}
                  />
                ) : (
                  <div className="tw:flex tw:min-h-[200px] tw:flex-col tw:items-center tw:justify-center tw:border tw:border-dashed tw:border-gray-300 tw:px-6 tw:text-center">
                    <MapPin size={25} className="tw:text-[#0C3F37]" />

                    <p className="tw:mt-2 tw:text-sm tw:text-gray-500">
                      No saved addresses. Add one to continue.
                    </p>

                    <Button
                      label="Add New Address"
                      icon={<Plus size={16} />}
                      onClick={handleAddAddress}
                      className={`tw:mt-3 ${ACCENT_BUTTON_CLASS}`}
                    />
                  </div>
                )}
              </div>

              {/* =================================================
                    PAYMENT
                ================================================= */}

              <div className="tw:border tw:border-gray-200 tw:bg-white tw:p-5 tw:sm:p-6">
                <div>
                  <h2 className="tw:text-lg tw:font-semibold tw:text-[#37252C]">
                    Payment
                  </h2>

                  <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                    Choose your payment method.
                  </p>
                </div>

                <Divider />

                {errors.payment && (
                  <div className="tw:mb-4 tw:border tw:border-red-200 tw:bg-red-50 tw:px-4 tw:py-3">
                    <p className="tw:text-sm tw:text-red-600">
                      {errors.payment}
                    </p>
                  </div>
                )}

                {/* ONLINE PAYMENT */}

                <div
                  className={`tw:flex tw:cursor-pointer tw:items-start tw:gap-4 tw:border tw:p-4 ${
                    paymentMethod === "ONLINE"
                      ? "tw:border-[#0C3F37] tw:bg-[#E3F0EE]"
                      : "tw:border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <RadioButton
                    inputId="online-payment"
                    name="payment"
                    value="ONLINE"
                    onChange={(e) => setPaymentMethod(e.value)}
                    checked={paymentMethod === "ONLINE"}
                  />

                  <div className="tw:flex tw:min-w-0 tw:flex-1 tw:items-start tw:justify-between tw:gap-4">
                    <div>
                      <label
                        htmlFor="online-payment"
                        className="tw:block tw:cursor-pointer tw:text-sm tw:font-semibold tw:text-[#37252C]"
                      >
                        Online Payment
                      </label>

                      <p className="tw:mt-1 tw:text-xs tw:leading-5 tw:text-gray-500">
                        Pay securely online using the available payment options.
                      </p>
                    </div>

                    <CreditCard
                      size={21}
                      className="tw:shrink-0 tw:text-[#0C3F37]"
                    />
                  </div>
                </div>

                <div className="tw:mt-4 tw:flex tw:items-start tw:gap-3 tw:border tw:border-gray-200 tw:bg-gray-50 tw:p-4">
                  <LockKeyhole
                    size={18}
                    className="tw:mt-0.5 tw:shrink-0 tw:text-gray-500"
                  />

                  <p className="tw:text-xs tw:leading-5 tw:text-gray-500">
                    Your payment information is handled securely. Online payment
                    gateway integration will be completed as part of the payment
                    flow.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                  RIGHT COLUMN - ORDER SUMMARY
              ================================================= */}

            <div className="tw:h-fit tw:border tw:border-gray-200 tw:bg-white">
              <div className="tw:p-5 tw:sm:p-6">
                <h2 className="tw:text-lg tw:font-semibold tw:text-[#37252C]">
                  Order Summary
                </h2>

                <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in your order
                </p>

                <Divider />

                {/* CART ITEMS */}

                <div className="tw:flex tw:flex-col tw:gap-4">
                  {cartItems.map((item) => {
                    const itemImage = item.image || item.images?.[0] || "";

                    const itemName = item.name || "Product";

                    const itemPrice = Number(item.price || 0);

                    return (
                      <div
                        key={item._id}
                        className="tw:flex tw:items-start tw:gap-3"
                      >
                        {/* IMAGE */}

                        <div className="tw:h-16 tw:w-16 tw:shrink-0 tw:overflow-hidden tw:bg-gray-100">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={itemName}
                              className="tw:h-full tw:w-full tw:object-cover"
                            />
                          ) : (
                            <div className="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center">
                              <MapPin size={18} className="tw:text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* INFO */}

                        <div className="tw:min-w-0 tw:flex-1">
                          <p className="tw:line-clamp-2 tw:text-sm tw:font-medium tw:text-[#37252C]">
                            {itemName}
                          </p>

                          <p className="tw:mt-1 tw:text-xs tw:text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        {/* PRICE */}

                        <p className="tw:shrink-0 tw:text-sm tw:font-medium tw:text-[#37252C]">
                          ₹{formatINR(itemPrice * Number(item.quantity || 1))}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Divider />

                <div className="tw:mb-4 tw:flex tw:w-full tw:flex-col tw:gap-2 tw:sm:flex-row">
                  <InputText
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="tw:w-full tw:min-w-0 tw:sm:flex-1"
                  />
                  <Button
                    label="Apply"
                    onClick={handleApplyCoupon}
                    className={`tw:w-full tw:shrink-0 tw:!justify-center tw:sm:w-auto ${ACCENT_BUTTON_CLASS}`}
                  />
                </div>

                {/* PRICE BREAKDOWN */}

                <div className="tw:flex tw:flex-col tw:gap-3 tw:text-sm">
                  <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                    <span className="tw:text-gray-500">Subtotal</span>

                    <span className="tw:font-medium tw:text-[#37252C]">
                      ₹{formatINR(subtotal)}
                    </span>
                  </div>

                  <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                    <span className="tw:text-gray-500">Shipping</span>

                    <span className="tw:font-medium tw:text-[#37252C]">
                      {Number(effectiveShipping || 0) === 0
                        ? "FREE"
                        : `₹${formatINR(effectiveShipping)}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                      <span className="tw:text-gray-500">
                        Coupon ({appliedCoupon})
                      </span>
                      <span className="tw:font-medium tw:text-green-700">
                        − ₹{formatINR(discount)}
                      </span>
                    </div>
                  )}
                </div>

                <Divider />

                {/* TOTAL */}

                <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                  <span className="tw:text-base tw:font-semibold tw:text-[#37252C]">
                    Total
                  </span>

                  <span className="tw:text-xl tw:font-semibold tw:text-[#37252C]">
                    ₹{formatINR(finalTotal)}
                  </span>
                </div>

                {/* COMPLETE ORDER */}

                <Button
                  label={
                    isProcessing
                      ? "Processing..."
                      : `COMPLETE ORDER & PAY ₹${formatINR(finalTotal)}`
                  }
                  icon={!isProcessing ? <LockKeyhole size={16} /> : undefined}
                  loading={isProcessing}
                  disabled={isProcessing}
                  onClick={handleCompleteOrder}
                  className={`tw:mt-6 tw:w-full tw:!justify-center tw:!py-3.5 tw:text-sm tw:font-semibold ${ACCENT_BUTTON_CLASS}`}
                />

                {/* TRUST */}

                <div className="tw:mt-5 tw:flex tw:items-start tw:gap-3 tw:border tw:border-gray-200 tw:bg-gray-50 tw:p-4">
                  <ShieldCheck
                    size={19}
                    className="tw:mt-0.5 tw:shrink-0 tw:text-[#0C3F37]"
                  />

                  <div>
                    <p className="tw:text-xs tw:font-semibold tw:text-[#37252C]">
                      Secure Checkout
                    </p>

                    <p className="tw:mt-1 tw:text-xs tw:leading-5 tw:text-gray-500">
                      Your order and account information are protected
                      throughout checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
            ADD ADDRESS DIALOG
        ===================================================== */}

      <Dialog
        visible={showAddressForm}
        onHide={handleAddressCancel}
        modal
        dismissableMask
        blockScroll
        closable={false}
        draggable={false}
        className="tw:w-[95vw] tw:sm:w-[90vw] tw:lg:w-[720px]"
        contentClassName="tw:!p-0"
      >
        <div className="tw:max-h-[85vh] tw:overflow-y-auto tw:p-5 tw:sm:p-7">
          <AddressForm
            onSuccess={handleAddressSuccess}
            onCancel={handleAddressCancel}
          />
        </div>
      </Dialog>

      {/* =====================================================
            LOGIN
        ===================================================== */}

      <LoginSignupOverlay
        visible={showLogin}
        onHide={() => setShowLogin(false)}
      />
    </>
  );
};

export default CheckoutSection;
