/* eslint-disable no-unused-vars */

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

/* ============================================================
   DESIGN TOKENS
============================================================ */

const BRAND_GREEN = "#1E3229";
const BRAND_GREEN_DARK = "#152219";
const BORDER = "#E7E1D6";
const TEXT = "#221F1C";
const MUTED = "#6B6459";
const GOLD = "#A67C3D";

/* ============================================================
   HELPERS
============================================================ */

const formatINR = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const getProductId = (item) => {
  return item?.productId?._id || item?.productId || item?._id || item?.id;
};

const getProduct = (item) => {
  // Backend cart:
  // {
  //   productId: populated product object,
  //   quantity,
  //   price
  // }

  if (item?.productId && typeof item.productId === "object") {
    return item.productId;
  }

  // Guest/local cart:
  // product fields may already exist directly on item

  return item;
};

const getProductName = (item) => {
  const product = getProduct(item);

  return product?.name || "Jewellery Item";
};

const getProductPrice = (item) => {
  // Important:
  // For backend cart, cart item price is the snapshot price.
  // Do not blindly use product.price.

  if (typeof item?.price === "number") {
    return item.price;
  }

  const product = getProduct(item);

  return Number(product?.price || 0);
};

const getProductImage = (item) => {
  const product = getProduct(item);

  return product?.image || product?.images?.[0] || "";
};

const getProductCategory = (item) => {
  const product = getProduct(item);

  if (!product?.category) {
    return "ROSHNI CREATIONS";
  }

  if (typeof product.category === "object") {
    return (
      product.category.title || product.category.name || "ROSHNI CREATIONS"
    );
  }

  return product.category;
};

const getMaxStock = (item) => {
  const product = getProduct(item);

  if (product?.availability === "made-to-order") {
    return Infinity;
  }

  if (product?.availability === "out-of-stock") {
    return 0;
  }

  return Number(product?.stockLeft || Infinity);
};

/* ============================================================
   PRODUCT THUMBNAIL
============================================================ */

function ProductThumb({ image, name }) {
  return (
    <div
      className="
        tw:h-20
        tw:w-20
        tw:sm:h-28
        tw:sm:w-28
        tw:shrink-0
        tw:overflow-hidden
        tw:rounded-lg
        tw:bg-[#f4eedc]
        tw:border
        tw:border-[#e7e1d5]
      "
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="
            tw:h-full
            tw:w-full
            tw:object-cover
            tw:transition-transform
            tw:duration-500
            tw:hover:scale-[1.03]
          "
        />
      ) : (
        <div
          className="
            tw:h-full
            tw:w-full
            tw:flex
            tw:items-center
            tw:justify-center
            tw:text-xs
          "
          style={{ color: MUTED }}
        >
          No image
        </div>
      )}
    </div>
  );
}

/* ============================================================
   QUANTITY STEPPER
============================================================ */

function QuantityStepper({ value, maxStock, onChange }) {
  const canIncrease = maxStock === Infinity || value < maxStock;

  return (
    <div
      className="
        tw:inline-flex
        tw:items-center
        tw:rounded-md
        tw:border
        tw:overflow-hidden
      "
      style={{
        borderColor: BRAND_GREEN,
      }}
    >
      <Button
        icon="pi pi-minus"
        text
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
        className="
          tw:!h-8
          tw:!w-8
          tw:!rounded-none
          tw:!p-0
        "
        style={{
          color: BRAND_GREEN,
        }}
      />

      <span
        className="
          tw:w-8
          tw:text-center
          tw:text-sm
          tw:font-medium
        "
        style={{
          color: BRAND_GREEN_DARK,
        }}
      >
        {value}
      </span>

      <Button
        icon="pi pi-plus"
        text
        disabled={!canIncrease}
        onClick={() => {
          if (canIncrease) {
            onChange(value + 1);
          }
        }}
        aria-label="Increase quantity"
        className="
          tw:!h-8
          tw:!w-8
          tw:!rounded-none
          tw:!p-0
          
        "
        style={{
          color: BRAND_GREEN,
        }}
      />
    </div>
  );
}

/* ============================================================
   CART LINE
============================================================ */

function CartLine({ item, onQtyChange, onRemove, onSave }) {
  const product = getProduct(item);

  const productId = getProductId(item);
  const name = getProductName(item);
  const price = getProductPrice(item);
  const image = getProductImage(item);
  const category = getProductCategory(item);
  const maxStock = getMaxStock(item);

  const quantity = Number(item?.quantity || 1);

  const lineTotal = price * quantity;

  const availability = product?.availability;

  return (
    <div
      className="
        tw:flex
        tw:flex-row
        tw:gap-4
        tw:sm:gap-5
        tw:py-6
        tw:border-b
      "
      style={{
        borderColor: BORDER,
      }}
    >
      <ProductThumb image={image} name={name} />

      <div
        className="
          tw:flex
          tw:flex-1
          tw:flex-col
          tw:sm:flex-row
          tw:gap-4
          tw:sm:justify-between
        "
      >
        {/* PRODUCT INFORMATION */}

        <div
          className="
            tw:flex
            tw:flex-col
            tw:gap-1
            tw:min-w-0
          "
        >
          <span
            className="
              tw:text-[9px]
              tw:sm:text-[11px]
              tw:tracking-[0.12em]
              tw:font-medium
            "
            style={{
              color: GOLD,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {category}
          </span>

          <h3
            className="
              tw:text-[13px]
              tw:sm:text-xl
              tw:leading-snug
              tw:pr-2
            "
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: TEXT,
            }}
          >
            {name}
          </h3>

          {/* MOBILE PRICE */}

          <span
            className="
              tw:text-[12px]
              tw:sm:hidden
            "
            style={{
              color: MUTED,
            }}
          >
            {formatINR(price)}
          </span>

          {/* AVAILABILITY */}

          {availability === "made-to-order" && (
            <span
              className="
                tw:text-[10px]
                tw:sm:text-xs
                tw:mt-1
              "
              style={{
                color: GOLD,
              }}
            >
              Made to order
            </span>
          )}

          {availability === "out-of-stock" && (
            <span
              className="
                tw:text-[10px]
                tw:sm:text-xs
                tw:mt-1
              "
              style={{
                color: "#9B3D32",
              }}
            >
              Currently unavailable
            </span>
          )}

          {/* ACTIONS */}

          <div
            className="
              tw:flex
              tw:gap-3
              tw:mt-2
            "
          >
            <button
              type="button"
              onClick={() => onSave(productId)}
              className="
                tw:text-[12px]
                tw:sm:text-[15px]
                tw:underline
                tw:underline-offset-2
                tw:cursor-pointer
              "
              style={{
                color: MUTED,
              }}
            >
              Save for later
            </button>

            <span
              style={{
                color: "#C9C2B4",
              }}
            >
              |
            </span>

            <button
              type="button"
              onClick={() => onRemove(productId)}
              className="
                tw:text-[12px]
                tw:sm:text-[15px]
                tw:underline
                tw:underline-offset-2
                tw:cursor-pointer
              "
              style={{
                color: MUTED,
              }}
            >
              Remove
            </button>
          </div>
        </div>

        {/* QUANTITY + PRICE */}

        <div
          className="
            tw:flex
            tw:flex-row
            tw:sm:flex-col
            tw:items-center
            tw:sm:items-end
            tw:justify-between
            tw:sm:justify-start
            tw:gap-3
            tw:sm:min-w-[7rem]
          "
        >
          <QuantityStepper
            value={quantity}
            maxStock={maxStock}
            onChange={(newQuantity) => onQtyChange(productId, newQuantity)}
          />

          <span
            className="
              tw:hidden
              tw:sm:block
              tw:text-sm
              tw:font-medium
            "
            style={{
              color: TEXT,
            }}
          >
            {formatINR(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({ label, value, highlight, muted }) {
  return (
    <div
      className="
        tw:flex
        tw:items-center
        tw:justify-between
        tw:py-2
        tw:text-[12px]
        tw:sm:text-sm
      "
    >
      <span
        style={{
          color: MUTED,
        }}
      >
        {label}
      </span>

      <span
        className="tw:font-medium"
        style={{
          color: highlight ? BRAND_GREEN : muted ? "#8a8378" : TEXT,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   PAYMENT METHODS
============================================================ */

const PAYMENT_METHODS = ["UPI", "GPay", "PhonePe", "VISA", "MC"];

/* ============================================================
   MAIN CART
============================================================ */

export default function JewelryCartSection() {
  const {
    cartItems = [],
    cartCount = 0,

    subtotal = 0,
    discount = 0,
    tax = 0,
    shipping = 0,
    total = 0,

    updateQuantity,
    removeFromCart,
    saveForLater,

    loading = false,
    error = null,
  } = useCart();

  const navigate = useNavigate();

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div
        className="
          tw:min-h-screen
          tw:w-full
          tw:flex
          tw:items-center
          tw:justify-center
        "
        style={{
          background: "#FAF7F2",
          color: MUTED,
        }}
      >
        <div className="tw:text-center">
          <i
            className="
              pi pi-spin
              pi-spinner
              tw:text-2xl
              tw:mb-3
            "
            style={{
              color: BRAND_GREEN,
            }}
          />

          <p className="tw:text-sm">Loading your jewellery bag...</p>
        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN
  ============================================================ */

  return (
    <div
      className="
        
        tw:w-full
      "
      style={{
        background: "#FAF7F2",
      }}
    >
      <div
        className="
          tw:mx-auto
          tw:max-w-7xl
          tw:px-4
          tw:sm:px-6
          tw:lg:px-10
          tw:py-8
          tw:sm:py-12
        "
      >
        {/* ERROR */}

        {error && (
          <div
            className="
              tw:mb-6
              tw:rounded-lg
              tw:border
              tw:px-4
              tw:py-3
              tw:text-sm
            "
            style={{
              borderColor: "#E3C5C1",
              background: "#FFF7F5",
              color: "#9B3D32",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="
            tw:grid
            tw:grid-cols-1
            tw:lg:grid-cols-3
            tw:gap-8
            tw:lg:gap-10
          "
        >
          {/* ======================================================
              CART ITEMS
          ====================================================== */}

          <div
            className="
              tw:lg:col-span-2
            "
          >
            <div
              className="
                tw:flex
                tw:items-center
                tw:justify-between
                tw:pb-3
                tw:border-b
                tw:text-xs
                tw:tracking-[0.12em]
                tw:font-medium
              "
              style={{
                borderColor: TEXT,
                color: MUTED,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <span>YOUR ITEMS ({cartCount})</span>

              <span className="tw:hidden tw:sm:inline">
                PRICE &amp; DETAILS
              </span>
            </div>

            {/* EMPTY CART */}

            {cartItems.length === 0 ? (
              <div
                className="
                  tw:py-20
                  tw:text-center
                "
                style={{
                  color: "#8a8378",
                }}
              >
                <i
                  className="
                    pi pi-shopping-bag
                    tw:text-3xl
                    tw:mb-4
                  "
                  style={{
                    color: GOLD,
                  }}
                />

                <h3
                  className="
                    tw:text-xl
                    tw:sm:text-2xl
                    tw:mb-2
                  "
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: TEXT,
                  }}
                >
                  Your bag is empty
                </h3>

                <p className="tw:text-sm tw:mb-6">
                  Discover something beautiful for your next occasion.
                </p>

                <Button
                  label="Continue shopping"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  onClick={() => navigate("/products")}
                  className="
                    tw:!border-none
                    tw:!rounded-md
                    tw:!px-5
                    tw:!py-3
                  "
                  style={{
                    background: BRAND_GREEN,
                    color: "#FFFFFF",
                  }}
                />
              </div>
            ) : (
              cartItems.map((item) => {
                const id = getProductId(item);

                return (
                  <CartLine
                    key={id}
                    item={item}
                    onQtyChange={updateQuantity}
                    onRemove={removeFromCart}
                    onSave={saveForLater}
                  />
                );
              })
            )}

            {/* ====================================================
                CONTINUE SHOPPING
            ==================================================== */}

            {cartItems.length > 0 && (
              <>
                <div
                  className="
                    tw:flex
                    tw:flex-col
                    tw:sm:flex-row
                    tw:items-start
                    tw:sm:items-center
                    tw:sm:justify-between
                    tw:gap-3
                    tw:pt-6
                    tw:text-sm
                  "
                >
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="
                      tw:inline-flex
                      tw:items-center
                      tw:gap-2
                      tw:font-medium
                      tw:cursor-pointer
                    "
                    style={{
                      color: TEXT,
                    }}
                  >
                    <i className="pi pi-arrow-left tw:!text-[11px] tw:sm:text-xs" />
                    Continue shopping
                  </button>

                  <span
                    style={{
                      color: MUTED,
                    }}
                  >
                    Need advice? Call our jewellery stylist:{" "}
                    <a
                      href="tel:+917082252235"
                      className="tw:font-semibold"
                      style={{
                        color: TEXT,
                      }}
                    >
                      +91 7082252235
                    </a>
                  </span>
                </div>

                {/* ==================================================
                    PACKAGING
                ================================================== */}

                <div
                  className="
                    tw:mt-4
                    tw:sm:mt-6
                    tw:flex
                    tw:items-start
                    tw:gap-4
                    tw:rounded-lg
                    tw:border
                    tw:p-3
                    tw:sm:p-5
                  "
                  style={{
                    borderColor: BORDER,
                  }}
                >
                  <div
                    className="
                      tw:h-11
                      tw:w-11
                      tw:shrink-0
                      tw:rounded-full
                      tw:flex
                      tw:items-center
                      tw:justify-center
                    "
                    style={{
                      background: "#F1EAD9",
                    }}
                  >
                    <i
                      className="pi pi-gift"
                      style={{
                        color: GOLD,
                      }}
                    />
                  </div>

                  <div>
                    <h4
                      className="
                        tw:text-sm
                        tw:font-semibold
                        tw:mb-1
                      "
                      style={{
                        color: TEXT,
                      }}
                    >
                      Signature Roshni packaging
                    </h4>

                    <p
                      className="
                        tw:text-[12px]
                        tw:sm:text-sm
                        tw:leading-relaxed
                      "
                      style={{
                        color: MUTED,
                      }}
                    >
                      Complimentary presentation box and anti-tarnish storage
                      pouch with your jewellery.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ======================================================
              ORDER SUMMARY
          ====================================================== */}

          <div className="tw:lg:col-span-1">
            <div
              className="
                tw:rounded-xl
                tw:border
                tw:p-5
                tw:sm:p-7
                tw:bg-white
                tw:lg:sticky
                tw:lg:top-8
              "
              style={{
                borderColor: BORDER,
              }}
            >
              <h2
                className="
                  tw:text-xl
                  tw:sm:text-2xl
                  tw:mb-2
                  tw:sm:mb-4
                "
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: TEXT,
                }}
              >
                Order summary
              </h2>

              <div
                className="tw:divide-y"
                style={{
                  borderColor: "#EFEAE0",
                }}
              >
                <SummaryRow label="Bag subtotal" value={formatINR(subtotal)} />

                <SummaryRow
                  label="Estimated express shipping"
                  value={shipping === 0 ? "Free" : formatINR(shipping)}
                  highlight
                />

                {discount > 0 && (
                  <SummaryRow
                    label="Festive discount"
                    value={`− ${formatINR(discount)}`}
                    highlight
                  />
                )}

                <SummaryRow
                  label="Estimated taxes (GST 3%)"
                  value={formatINR(tax)}
                  muted
                />
              </div>

              {/* TOTAL */}

              <div
                className="
                  tw:flex
                  tw:items-end
                  tw:justify-between
                  tw:pt-4
                  tw:mt-2
                  tw:border-t
                "
                style={{
                  borderColor: TEXT,
                }}
              >
                <span
                  className="
                    tw:text-base
                    tw:font-medium
                  "
                  style={{
                    color: TEXT,
                  }}
                >
                  Total
                </span>

                <div className="tw:text-right">
                  <div
                    className="
                      tw:text-2xl
                      tw:font-semibold
                    "
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: TEXT,
                    }}
                  >
                    {formatINR(total)}
                  </div>

                  <div
                    className="tw:text-xs"
                    style={{
                      color: "#8a8378",
                    }}
                  >
                    Inclusive of applicable duties
                  </div>
                </div>
              </div>

              {/* ==================================================
                  CHECKOUT
              ================================================== */}

              <Button
                label="Proceed to checkout"
                icon="pi pi-arrow-right"
                iconPos="right"
                disabled={cartItems.length === 0}
                className="
                  tw:!w-full
                  tw:!mt-6
                  tw:!rounded-md
                  tw:!border-none
                  tw:!py-3.5
                  tw:!text-sm
                  tw:!tracking-wide
                  tw:!font-semibold
                "
                style={{
                  background: BRAND_GREEN,
                  color: "#FFFFFF",
                }}
                onClick={() => navigate("/checkout")}
              />

              {/* ==================================================
                  PAYMENT
              ================================================== */}

              <p
                className="
                  tw:text-center
                  tw:text-[11px]
                  tw:tracking-[0.1em]
                  tw:mt-5
                  tw:mb-3
                "
                style={{
                  color: "#8a8378",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                SECURED INSTANT CHECKOUTS
              </p>

              <div
                className="
                  tw:flex
                  tw:flex-wrap
                  tw:justify-center
                  tw:gap-2
                "
              >
                {PAYMENT_METHODS.map((method) => (
                  <span
                    key={method}
                    className="
                        tw:rounded-md
                        tw:border
                        tw:px-3
                        tw:py-1.5
                        tw:text-xs
                        tw:font-medium
                      "
                    style={{
                      borderColor: "#E0D9CB",
                      color: TEXT,
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>

              {/* ==================================================
                  CHECKOUT AUTH NOTE
              ================================================== */}

              <div
                className="
                  tw:mt-5
                  tw:rounded-lg
                  tw:px-3
                  tw:py-3
                  tw:text-[11px]
                  tw:leading-relaxed
                  tw:text-center
                "
                style={{
                  background: "#F7F4ED",
                  color: MUTED,
                }}
              >
                You can shop and add items to your bag without an account. Login
                or register will only be required when you proceed with
                checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
