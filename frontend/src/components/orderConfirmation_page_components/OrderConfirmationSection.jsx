/* eslint-disable no-unused-vars */
import jsPDF from "jspdf";
import { useEffect } from "react";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";

const BRAND = "#0C3F37";

const DEFAULT_TIMELINE = [
  {
    label: "Order Confirmed",
    status: "done",
  },
  {
    label: "Payment Received",
    status: "done",
  },
  {
    label: "Preparing Your Jewellery",
    status: "active",
  },
  {
    label: "Dispatched",
    status: "pending",
  },
  {
    label: "Delivered",
    status: "pending",
  },
];

function formatINR(amount = 0) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

/* =========================================================
   PAYMENT
========================================================= */

function getPaymentLabel(order) {
  const method = order?.payment?.method || order?.paymentMethod || "ONLINE";

  switch (String(method).toUpperCase()) {
    case "ONLINE":
      return "Online Payment";

    case "UPI":
      return "UPI";

    case "CARD":
      return "Credit / Debit Card";

    case "NETBANKING":
      return "Net Banking";

    case "COD":
      return "Cash on Delivery";

    default:
      return method;
  }
}

/* =========================================================
   ORDER ID
========================================================= */

// function getOrderId(order) {
//   return order?.orderId || order?.orderNumber || order?._id || "N/A";
// }

function getOrderId(order) {
  return order?.orderNumber || "N/A";
}

/* =========================================================
   CUSTOMER
========================================================= */

function getCustomer(order) {
  const customer = order?.addressId || {};

  const firstName = customer.firstName || order?.addressId?.firstName || "";

  const lastName = customer.lastName || order?.addressId?.lastName || "";

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim() || "Customer",
    email: customer.email || "",
    phone: customer.phone || "",
  };
}

/* =========================================================
   DELIVERY DATE
========================================================= */

function getEstimatedDelivery(order) {
  const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date();

  // Current checkout/order flow:
  // estimated delivery = 5 days from order creation.
  createdAt.setDate(createdAt.getDate() + 5);

  return createdAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   ADDRESS
========================================================= */

function getShippingAddress(order) {
  return order?.addressId || {};
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

function getItemImage(item) {
  return (
    item?.image ||
    item?.images?.[0] ||
    item?.product?.image ||
    item?.product?.images?.[0] ||
    ""
  );
}

/* =========================================================
   PRODUCT NAME
========================================================= */

function getItemName(item) {
  return item?.name || item?.product?.name || "Jewellery";
}

/* =========================================================
   PRODUCT CATEGORY
========================================================= */

function getItemCategory(item) {
  const category = item?.category || item?.product?.category;

  if (!category) return "";

  if (typeof category === "string") {
    return category;
  }

  return category.title || category.name || category.category || "";
}

/* =========================================================
   ITEM KEY
========================================================= */

function getItemKey(item, index) {
  return (
    item?._id ||
    item?.id ||
    item?.productId?._id ||
    item?.productId ||
    item?.product?._id ||
    `order-item-${index}`
  );
}

/* =========================================================
   INVOICE
========================================================= */


function downloadInvoice(order) {
  const customer = getCustomer(order);
  const address = getShippingAddress(order);
  const items = order?.items || [];

  const subtotal = Number(
    order?.pricing?.subtotal ?? order?.subtotal ?? 0
  );

  const discount = Number(
    order?.pricing?.discount ?? order?.discount ?? 0
  );

  const tax = Number(order?.pricing?.tax ?? order?.tax ?? 0);

  const shipping = Number(
    order?.pricing?.shipping ?? order?.shipping ?? 0
  );

  const total = Number(
    order?.pricing?.total ??
      order?.total ??
      order?.grandTotal ??
      subtotal - discount + tax + shipping
  );

  const orderId = getOrderId(order);

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  /* =========================================================
     HEADER
  ========================================================= */

  doc.setTextColor(12, 63, 55);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);

  doc.text("ROSHNI CREATIONS", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.setTextColor(100, 100, 100);

  doc.text(
    "Handcrafted Jewelry for Everyday Elegance",
    20,
    32
  );

  /* =========================================================
     INVOICE TITLE
  ========================================================= */

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text("INVOICE", pageWidth - 20, 25, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.setTextColor(100, 100, 100);

  doc.text(
    `Order ID: ${orderId}`,
    pageWidth - 20,
    32,
    { align: "right" }
  );

  doc.text(
    `Order Date: ${orderDate}`,
    pageWidth - 20,
    38,
    { align: "right" }
  );

  /* =========================================================
     DIVIDER
  ========================================================= */

  doc.setDrawColor(220, 220, 220);
  doc.line(20, 45, pageWidth - 20, 45);

  /* =========================================================
     CUSTOMER
  ========================================================= */

  let y = 58;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);

  doc.text("BILL TO", 20, y);

  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  doc.text(customer.name || "Customer", 20, y);

  y += 5;

  if (customer.email) {
    doc.text(customer.email, 20, y);
    y += 5;
  }

  if (customer.phone) {
    doc.text(`+91 ${customer.phone}`, 20, y);
    y += 5;
  }

  /* =========================================================
     SHIPPING ADDRESS
  ========================================================= */

  const addressStartX = pageWidth / 2 + 10;

  let addressY = 58;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);

  doc.text("SHIPPING ADDRESS", addressStartX, addressY);

  addressY += 7;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  const addressLines = [
    address.flat,
    address.street,
    [address.city, address.state]
      .filter(Boolean)
      .join(", "),
    address.pincode || address.pin
      ? `PIN: ${address.pincode || address.pin}`
      : "",
    address.landmark
      ? `Landmark: ${address.landmark}`
      : "",
  ].filter(Boolean);

  addressLines.forEach((line) => {
    doc.text(String(line), addressStartX, addressY);
    addressY += 5;
  });

  /* =========================================================
     ITEMS HEADER
  ========================================================= */

  y = Math.max(y, addressY) + 12;

  doc.setFillColor(12, 63, 55);
  doc.rect(20, y - 5, pageWidth - 40, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text("ITEM", 24, y + 1);
  doc.text("QTY", 125, y + 1);
  doc.text("PRICE", 150, y + 1);
  doc.text("TOTAL", pageWidth - 24, y + 1, {
    align: "right",
  });

  y += 12;

  /* =========================================================
     ITEMS
  ========================================================= */

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);

  items.forEach((item) => {
    const quantity = Number(item?.quantity || 1);
    const price = Number(item?.price || 0);
    const itemTotal = price * quantity;

    const name = getItemName(item);

    doc.text(name.substring(0, 55), 24, y);

    doc.text(String(quantity), 127, y);

    doc.text(formatINR(price), 150, y);

    doc.text(formatINR(itemTotal), pageWidth - 24, y, {
      align: "right",
    });

    y += 8;

    doc.setDrawColor(235, 235, 235);
    doc.line(20, y - 3, pageWidth - 20, y - 3);
  });

  /* =========================================================
     PRICE DETAILS
  ========================================================= */

  y += 8;

  const priceX = pageWidth - 24;
  const labelX = pageWidth - 90;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  doc.text("Subtotal", labelX, y);
  doc.text(formatINR(subtotal), priceX, y, {
    align: "right",
  });

  y += 7;

  if (discount > 0) {
    doc.text("Discount", labelX, y);

    doc.setTextColor(40, 120, 70);

    doc.text(`-${formatINR(discount)}`, priceX, y, {
      align: "right",
    });

    doc.setTextColor(80, 80, 80);

    y += 7;
  }

  if (tax > 0) {
    doc.text("Tax", labelX, y);

    doc.text(formatINR(tax), priceX, y, {
      align: "right",
    });

    y += 7;
  }

  doc.text("Shipping", labelX, y);

  doc.text(
    shipping > 0 ? formatINR(shipping) : "FREE",
    priceX,
    y,
    {
      align: "right",
    }
  );

  y += 9;

  doc.setDrawColor(210, 210, 210);
  doc.line(labelX, y, priceX, y);

  y += 9;

  /* =========================================================
     TOTAL
  ========================================================= */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(12, 63, 55);

  doc.text("TOTAL PAID", labelX, y);

  doc.text(formatINR(total), priceX, y, {
    align: "right",
  });

  /* =========================================================
     PAYMENT
  ========================================================= */

  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  doc.text(
    `Payment Method: ${getPaymentLabel(order)}`,
    20,
    y
  );

  /* =========================================================
     FOOTER
  ========================================================= */

  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(220, 220, 220);

  doc.line(
    20,
    pageHeight - 30,
    pageWidth - 20,
    pageHeight - 30
  );

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);

  doc.text(
    "Thank you for shopping with Roshni Creations.",
    pageWidth / 2,
    pageHeight - 22,
    {
      align: "center",
    }
  );

  doc.text(
    "Handcrafted with care.",
    pageWidth / 2,
    pageHeight - 17,
    {
      align: "center",
    }
  );

  /* =========================================================
     DOWNLOAD PDF
  ========================================================= */

  doc.save(
    `Roshni-Creations-Invoice-${orderId}.pdf`
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OrderConfirmationSection() {
  const location = useLocation();
  const navigate = useNavigate();

  /* =======================================================
     GET ORDER

     1. Order returned from Checkout
     2. localStorage fallback for refresh
  ======================================================= */

  const order =
    location.state?.order ||
    JSON.parse(localStorage.getItem("roshni_last_order") || "null");

  /* =======================================================
     SAVE ORDER FOR REFRESH
  ======================================================= */

  useEffect(() => {
    if (location.state?.order) {
      localStorage.setItem(
        "roshni_last_order",
        JSON.stringify(location.state.order),
      );
    }
  }, [location.state?.order]);

  /* =======================================================
     NO ORDER
  ======================================================= */

  console.log("order address",order.addressId)

  if (!order) {
    return (
      <div className="tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:bg-[#faf7f1] tw:px-4">
        <div className="tw:w-full tw:max-w-md tw:text-center">
          <div
            className="tw:mx-auto tw:flex tw:h-14 tw:w-14 tw:items-center tw:justify-center tw:rounded-full tw:border"
            style={{
              borderColor: BRAND,
              color: BRAND,
            }}
          >
            <i className="pi pi-exclamation-circle tw:text-2xl" />
          </div>

          <h2 className="tw:mt-5 tw:font-serif tw:text-3xl tw:text-neutral-900">
            Order Not Found
          </h2>

          <p className="tw:mt-2 tw:text-sm tw:leading-relaxed tw:text-neutral-500">
            We couldn't find your order details. Please continue shopping and
            place your order again.
          </p>

          <Button
            label="Continue Shopping"
            icon="pi pi-arrow-left"
            onClick={() => navigate("/products")}
            className="tw:!mt-6 tw:!rounded-full tw:!border-0 tw:!px-7 tw:!py-3 tw:!text-white"
            style={{
              backgroundColor: BRAND,
            }}
          />
        </div>
      </div>
    );
  }

  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const customer = getCustomer(order);

  const orderId = getOrderId(order);  

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const estimatedDelivery = getEstimatedDelivery(order);

  const paymentMethod = getPaymentLabel(order);

  const items = order?.items || [];

  const address = getShippingAddress(order);

  /* =======================================================
     PRICING

     Supports both:

     order.pricing.subtotal

     OR

     order.subtotal
  ======================================================= */

  const subtotal = Number(order?.pricing?.subtotal ?? order?.subtotal ?? 0);

  const discount = Number(order?.pricing?.discount ?? order?.discount ?? 0);

  const tax = Number(order?.pricing?.tax ?? order?.tax ?? 0);

  const shipping = Number(order?.pricing?.shipping ?? order?.shipping ?? 0);

  const total = Number(
    order?.pricing?.total ??
      order?.total ??
      order?.grandTotal ??
      subtotal - discount + tax + shipping,
  );

  /* =======================================================
     ADDRESS LINES
  ======================================================= */

  const addressLines = [
    address.flat,
    address.street,
    [address.city, address.state].filter(Boolean).join(", "),
    address.pincode || address.pin,
  ].filter(Boolean);

  /* =======================================================
     TRACK ORDER
  ======================================================= */

  const handleTrackOrder = () => {
    document.getElementById("fulfillment-progress")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const handleDownloadInvoice = () => {
    downloadInvoice(order);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-[#faf7f1] tw:px-4 tw:py-10 tw:sm:px-6 tw:sm:py-14 tw:lg:px-10">
      <div className="tw:mx-auto tw:w-full tw:max-w-5xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="tw:flex tw:flex-col tw:items-center tw:text-center">
          {/* SUCCESS ICON */}

          <span
            className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-full tw:border"
            style={{
              borderColor: BRAND,
              color: BRAND,
            }}
          >
            <i className="pi pi-check tw:text-xl" />
          </span>

          <p className="tw:mt-5 tw:text-[11px] tw:font-medium tw:tracking-[0.2em] tw:text-neutral-500">
            ORDER CONFIRMED
          </p>

          <h1 className="tw:mt-3 tw:font-serif tw:text-3xl tw:italic tw:text-neutral-900 tw:sm:text-4xl">
            Thank You, {customer.name}
          </h1>

          <p className="tw:mt-4 tw:max-w-xl tw:text-sm tw:leading-relaxed tw:text-neutral-500">
            Your order{" "}
            <span className="tw:font-medium tw:text-neutral-700">
              #{orderId}
            </span>{" "}
            has been successfully placed. Our team will now prepare your
            jewellery with care.
          </p>

          {/* =================================================
              ORDER META
          ================================================= */}

          <div className="tw:mt-6 tw:flex tw:w-full tw:flex-col tw:items-center tw:gap-2 tw:text-xs tw:text-neutral-500 tw:sm:flex-row tw:sm:justify-center tw:sm:gap-8">
            <p>
              Order Date:{" "}
              <span className="tw:font-medium tw:text-neutral-700">
                {orderDate}
              </span>
            </p>

            <p>
              Payment:{" "}
              <span className="tw:font-medium tw:text-neutral-700">
                {paymentMethod}
              </span>
            </p>

            <p>
              Estimated Delivery:{" "}
              <span className="tw:font-medium tw:text-neutral-700">
                {estimatedDelivery}
              </span>
            </p>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="tw:mt-8 tw:flex tw:w-full tw:flex-col tw:items-center tw:gap-3 tw:sm:w-auto tw:sm:flex-row">
            {/* <Button
              label="Track Order"
              icon="pi pi-map-marker"
              onClick={handleTrackOrder}
              className="tw:!w-full tw:!justify-center tw:!rounded-full tw:!border-0 tw:!px-7 tw:!py-3 tw:!text-sm tw:!font-medium tw:!text-white tw:sm:!w-auto"
              style={{
                backgroundColor: BRAND,
              }}
            /> */}

            <Button
              label="Download Invoice"
              icon="pi pi-download"
              onClick={handleDownloadInvoice}
              outlined
              className="tw:!w-full tw:!justify-center tw:!rounded-full tw:!bg-transparent tw:!px-7 tw:!py-3 tw:!text-sm tw:!font-medium tw:sm:!w-auto"
              style={{
                borderColor: BRAND,
                color: BRAND,
              }}
            />
          </div>
        </div>

        <div className="tw:my-10 tw:border-t tw:border-neutral-200 tw:sm:my-12" />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="tw:grid tw:grid-cols-1 tw:gap-10 tw:lg:grid-cols-[minmax(0,1fr)_380px] tw:lg:gap-16">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div>
            {/* =================================================
                FULFILLMENT
            ================================================= */}

            <div id="fulfillment-progress">
              <p className="tw:text-[11px] tw:font-medium tw:tracking-[0.2em] tw:text-neutral-500">
                ORDER PROGRESS
              </p>

              <ul className="tw:mt-5 tw:space-y-5">
                {DEFAULT_TIMELINE.map((step, index) => (
                  <li
                    key={`${step.label}-${index}`}
                    className="tw:flex tw:items-center tw:gap-3"
                  >
                    <span
                      className={[
                        "tw:h-2.5 tw:w-2.5 tw:flex-none tw:rounded-full",

                        step.status === "done" && "tw:bg-[#0C3F37]",

                        step.status === "active" && "tw:bg-amber-500",

                        step.status === "pending" && "tw:bg-neutral-200",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />

                    <span
                      className={[
                        "tw:text-sm",

                        step.status === "pending"
                          ? "tw:text-neutral-400"
                          : "tw:font-medium tw:text-neutral-800",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* =================================================
                SHIPPING ADDRESS
            ================================================= */}

            <div className="tw:mt-10">
              <p className="tw:text-[11px] tw:font-medium tw:tracking-[0.2em] tw:text-neutral-500">
                DELIVERY ADDRESS
              </p>

              <div className="tw:mt-4 tw:text-sm tw:leading-relaxed tw:text-neutral-600">
                <p className="tw:font-medium tw:text-neutral-800">
                  {customer.name}
                </p>

                {addressLines.map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}

                {address.landmark && <p>Landmark: {address.landmark}</p>}

                {customer.phone && (
                  <p className="tw:mt-2">+91 {customer.phone}</p>
                )}

                {customer.email && <p>{customer.email}</p>}
              </div>
            </div>

            {/* =================================================
                SECURE ORDER
            ================================================= */}

            <div className="tw:mt-8 tw:flex tw:items-start tw:gap-3 tw:rounded-lg tw:bg-neutral-100/70 tw:p-4">
              <i className="pi pi-shield tw:mt-0.5 tw:text-neutral-500" />

              <div>
                <p className="tw:text-sm tw:font-medium tw:text-neutral-800">
                  Secure Order
                </p>

                <p className="tw:mt-1 tw:text-xs tw:leading-5 tw:text-neutral-500">
                  Your order and account information are securely handled
                  throughout the checkout process.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div>
            {/* =================================================
                ORDERED PIECES
            ================================================= */}

            <div className="tw:flex tw:items-center tw:justify-between">
              <p className="tw:text-[11px] tw:font-medium tw:tracking-[0.2em] tw:text-neutral-500">
                ORDERED PIECES ({items.length})
              </p>

              <p className="tw:text-xs tw:text-neutral-400">
                {items.length === 1 ? "1 item" : `${items.length} items`}
              </p>
            </div>

            {/* =================================================
                ITEMS
            ================================================= */}

            <ul className="tw:mt-5 tw:space-y-5">
              {items.map((item, index) => {
                const quantity = Number(item?.quantity || 1);

                const price = Number(item?.price || 0);

                const itemTotal = price * quantity;

                const image = getItemImage(item);

                const name = getItemName(item);

                const category = getItemCategory(item);

                return (
                  <li
                    key={getItemKey(item, index)}
                    className="tw:flex tw:items-center tw:gap-4"
                  >
                    {/* IMAGE */}

                    <div className="tw:relative tw:flex-none">
                      <div className="tw:h-16 tw:w-16 tw:overflow-hidden tw:rounded-md tw:bg-neutral-100">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="tw:h-full tw:w-full tw:object-cover"
                          />
                        ) : (
                          <div className="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center">
                            <i className="pi pi-image tw:text-neutral-300" />
                          </div>
                        )}
                      </div>

                      <span
                        className="tw:absolute tw:-right-2 tw:-top-2 tw:flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded-full tw:text-[10px] tw:text-white"
                        style={{
                          backgroundColor: BRAND,
                        }}
                      >
                        {quantity}
                      </span>
                    </div>

                    {/* INFO */}

                    <div className="tw:min-w-0 tw:flex-1">
                      <p className="tw:line-clamp-2 tw:text-sm tw:font-medium tw:text-neutral-800">
                        {name}
                      </p>

                      {category && (
                        <p className="tw:mt-1 tw:text-xs tw:text-neutral-400">
                          {category}
                        </p>
                      )}

                      <p className="tw:mt-1 tw:text-xs tw:text-neutral-400">
                        Qty: {quantity}
                      </p>
                    </div>

                    {/* PRICE */}

                    <div className="tw:flex-none tw:text-right">
                      <p className="tw:text-sm tw:font-medium tw:text-neutral-800">
                        {formatINR(itemTotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* =================================================
                PRICE DETAILS
            ================================================= */}

            <div className="tw:mt-6 tw:space-y-3 tw:border-t tw:border-neutral-200 tw:pt-5 tw:text-sm">
              <div className="tw:flex tw:items-center tw:justify-between">
                <span className="tw:text-neutral-500">Subtotal</span>

                <span className="tw:font-medium tw:text-neutral-800">
                  {formatINR(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="tw:flex tw:items-center tw:justify-between">
                  <span className="tw:text-neutral-500">Discount</span>

                  <span className="tw:font-medium tw:text-green-700">
                    -{formatINR(discount)}
                  </span>
                </div>
              )}

              {tax > 0 && (
                <div className="tw:flex tw:items-center tw:justify-between">
                  <span className="tw:text-neutral-500">Taxes</span>

                  <span className="tw:font-medium tw:text-neutral-800">
                    {formatINR(tax)}
                  </span>
                </div>
              )}

              <div className="tw:flex tw:items-center tw:justify-between">
                <span className="tw:text-neutral-500">Shipping</span>

                <span className="tw:font-medium tw:text-neutral-800">
                  {shipping > 0 ? formatINR(shipping) : "FREE"}
                </span>
              </div>
            </div>

            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="tw:mt-4 tw:flex tw:items-center tw:justify-between tw:border-t tw:border-neutral-200 tw:pt-4">
              <span className="tw:font-serif tw:text-lg tw:italic tw:text-neutral-900">
                Total Paid
              </span>

              <span className="tw:font-serif tw:text-lg tw:italic tw:text-neutral-900">
                {formatINR(total)}
              </span>
            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <div className="tw:mt-5 tw:flex tw:items-center tw:justify-between tw:border tw:border-neutral-200 tw:bg-white tw:px-4 tw:py-3">
              <div className="tw:flex tw:items-center tw:gap-2">
                <i
                  className="pi pi-credit-card"
                  style={{
                    color: BRAND,
                  }}
                />

                <span className="tw:text-sm tw:text-neutral-600">Payment</span>
              </div>

              <span className="tw:text-sm tw:font-medium tw:text-neutral-800">
                {paymentMethod}
              </span>
            </div>

            {/* =================================================
                CONTINUE SHOPPING
            ================================================= */}

            <Button
              label="Continue Shopping"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => navigate("/products")}
              outlined
              className="tw:!mt-6 tw:!w-full tw:!rounded-lg tw:!py-3"
              style={{
                borderColor: BRAND,
                color: BRAND,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
