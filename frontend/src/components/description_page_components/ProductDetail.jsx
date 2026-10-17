import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

import { useCart } from "../../context/CartContext";
import { getProducts } from "../../services/productService";

/* =========================================================
   Helpers
========================================================= */

function formatINR(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function getCategoryName(category) {
  if (!category) return "Jewellery";

  if (typeof category === "string") {
    return category;
  }

  return (
    category.name || category.title || category.categoryName || "Jewellery"
  );
}

function getProductImages(product) {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images.filter(Boolean);
  }

  if (product?.image) {
    return [product.image];
  }

  return [];
}

function getProductStock(product) {
  const stock = Number(product?.stockLeft);

  if (Number.isFinite(stock) && stock > 0) {
    return stock;
  }

  return 0;
}

function getProductPrice(product) {
  const price = Number(product?.price);

  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getComparePrice(product, price) {
  const compareAtPrice = Number(product?.compareAtPrice);

  if (Number.isFinite(compareAtPrice) && compareAtPrice > 0) {
    return compareAtPrice;
  }

  return price;
}

/* =========================================================
   Component
========================================================= */

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const toast = useRef(null);
  const sliderRef = useRef(null);

  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     Fetch products
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        /*
          Supports:

          {
            success: true,
            products: [...]
          }

          {
            data: [...]
          }

          [...]
        */

        const productData = response?.products || response?.data || response;

        if (!mounted) return;

        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          console.error("Unexpected products response:", response);

          setProducts([]);
          setError("Invalid products response.");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);

        if (mounted) {
          setError("Unable to load products. Please try again.");
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     Find product
  ========================================================= */

  const product = products.find((item) => String(item?._id) === String(id));

  /* =========================================================
     Loading
  ========================================================= */

  if (loading) {
    return (
      <div className="tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:bg-[#faf7f1]">
        <div className="tw:text-center">
          <div className="tw:mx-auto tw:h-10 tw:w-10 tw:animate-spin tw:rounded-full tw:border-2 tw:border-[#e7e1d5] tw:border-t-[#b08d3e]" />

          <p className="tw:mt-4 tw:text-sm tw:text-[#6e6a62]">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     API error
  ========================================================= */

  if (error) {
    return (
      <div className="tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:bg-[#faf7f1]">
        <div className="tw:px-6 tw:text-center">
          <h2 className="tw:text-2xl tw:font-semibold tw:text-[#1c1c1a]">
            Something went wrong
          </h2>

          <p className="tw:mt-2 tw:text-sm tw:text-[#6e6a62]">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="
              tw:mt-5
              tw:cursor-pointer
              tw:bg-[#0C3F37]
              tw:px-6
              tw:py-3
              tw:text-white
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     Product not found
  ========================================================= */

  if (!product) {
    return (
      <div className="tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:bg-[#faf7f1]">
        <div className="tw:text-center">
          <h2 className="tw:text-2xl tw:font-semibold tw:text-[#1c1c1a]">
            Product not found
          </h2>

          <p className="tw:mt-2 tw:text-sm tw:text-[#6e6a62]">
            The product you're looking for doesn't exist.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="
              tw:mt-5
              tw:cursor-pointer
              tw:bg-[#0C3F37]
              tw:px-6
              tw:py-3
              tw:text-white
            "
          >
            Back to Jewellery
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     Normalize backend product data
  ========================================================= */

  const price = getProductPrice(product);

  const compareAtPrice = getComparePrice(product, price);

  const savedAmount = Math.max(compareAtPrice - price, 0);

  const discountPct =
    compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const images = getProductImages(product);

  const stockLeft = getProductStock(product);

  const categoryName = getCategoryName(product.category);

  const productName = product.name || "Unnamed Jewellery";

  const craftLabel = product.craftLabel || product.material || "Handcrafted";

  const productDetails =
    product.details ||
    "Beautifully handcrafted jewellery designed for everyday elegance.";

  const productCare =
    product.care ||
    "Store in a dry place and keep away from perfumes, water and chemicals.";

  const productShipping =
    product.shipping || "Orders are carefully packed and shipped across India.";

  const isOutOfStock = stockLeft <= 0;

  /* =========================================================
     Keep active image valid
  ========================================================= */

  const safeActiveImage =
    images.length > 0 ? Math.min(activeImage, images.length - 1) : 0;

  // when user scrolls/swipes, update which image is active
  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
  };

  // when user clicks a thumbnail, scroll to that image
  const goToImage = (i) => {
    setActiveImage(i);
    sliderRef.current?.scrollTo({
      left: i * sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  /* =========================================================
     Add to cart
  ========================================================= */

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.current?.show({
        severity: "warn",
        summary: "Out of stock",
        detail: "This product is currently unavailable.",
        life: 2500,
      });

      return;
    }

    const safeQuantity = Math.min(
      Math.max(Number(quantity) || 1, 1),
      stockLeft,
    );

    const result = await addToCart(product, safeQuantity);

    if (result?.success) {
      toast.current?.show({
        severity: "success",
        summary: "Added to bag",
        detail: `${productName} × ${safeQuantity}`,
        life: 2500,
      });

      /*
        Small delay so Toast can actually render
        before navigation unmounts this component.
      */
      setTimeout(() => {
        navigate("/cart");
      }, 300);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Unable to add",
        detail: result?.message || "Unable to add this product to your bag.",
        life: 2500,
      });
    }
  };

  /* =========================================================
     Quantity
  ========================================================= */

  const handleQuantityChange = (value) => {
    if (isOutOfStock) {
      setQuantity(0);
      return;
    }

    const nextValue = Number(value);

    if (!Number.isFinite(nextValue)) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(Math.max(Math.floor(nextValue), 1), stockLeft));
  };

  return (
    <div className="rc-pd tw:w-full tw:bg-[#faf7f1]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        .rc-pd { font-family: 'Manrope', sans-serif; }
        .rc-pd .rc-serif { font-family: 'Cormorant Garamond', serif; }

        .rc-pd .rc-thumb {
          border: 1px solid #e7e1d5;
          border-radius: 4px;
          overflow: hidden;
          padding: 2px;
          background: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .rc-pd .rc-thumb-active {
          border-color: #b08d3e;
          box-shadow: 0 0 0 1px #b08d3e;
        }

        .rc-pd .rc-wishlist.p-button {
          background: rgba(250, 247, 241, 0.9);
          border: 1px solid #b08d3e;
          color: #182a1f;
        }

        .rc-pd .rc-wishlist.p-button:hover {
          background: #fff;
        }

        .rc-pd .rc-tag-craft.p-tag {
          background: #17181a;
          color: #faf7f1;
          border: 1px solid #b08d3e;
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          padding: 0.4rem 0.7rem;
          border-radius: 2px;
        }

        .rc-pd .rc-tag-bestseller.p-tag {
          background: transparent;
          color: #b08d3e;
          border: 1px solid #b08d3e;
          font-weight: 600;
          font-size: 0.7rem;
          letter-spacing: 0.03em;
          border-radius: 999px;
          padding: 0.3rem 0.7rem;
        }

        .rc-pd .rc-tag-bestseller .p-tag-icon {
          color: #b08d3e;
        }

        .rc-pd .rc-tag-save.p-tag {
          background: #f4eedc;
          color: #8a6a1d;
          font-weight: 600;
          font-size: 0.75rem;
          border-radius: 2px;
          padding: 0.3rem 0.6rem;
        }

        .rc-pd .rc-tag-stock.p-tag {
          background: #f4eedc;
          color: #8a6a1d;
          font-weight: 600;
          font-size: 0.72rem;
          border-radius: 999px;
          padding: 0.3rem 0.75rem;
        }

        .rc-pd .rc-qty-btn.p-button {
          color: #182a1f;
          border-radius: 999px;
        }

        .rc-pd .rc-qty-btn.p-button:enabled:hover {
          background: #e4eee2;
          color: #23392c;
        }

        .rc-pd .rc-qty-input .p-inputtext {
          text-align: center;
          border: none;
          background: transparent;
          font-weight: 600;
          color: #1c1c1a;
          font-family: 'Manrope', sans-serif;
        }

        .rc-pd .rc-qty-input .p-inputtext:focus {
          box-shadow: none;
        }

        .rc-pd .rc-btn-primary.p-button {
          background: #0C3F37;
          border: 1px solid #182a1f;
          color: #faf7f1;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .rc-pd .rc-btn-primary.p-button:enabled:hover {
          background: #23392c;
          border-color: #b08d3e;
        }

        .rc-pd .rc-btn-primary .p-button-icon {
          color: #b08d3e;
        }

        .rc-pd .rc-btn-primary.p-disabled {
          opacity: 0.6;
        }

        .rc-pd .rc-accordion .p-accordion-tab {
          border: none;
          border-bottom: 1px solid #e7e1d5;
        }

        .rc-pd .rc-accordion .p-accordion-header-link,
        .rc-pd .rc-accordion .p-accordion-header .p-accordion-header-link {
          background: transparent !important;
          border: none !important;
          color: #1c1c1a !important;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          padding: 1.1rem 0 !important;
          box-shadow: none !important;
        }

        .rc-pd .rc-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          color: #182a1f !important;
        }

        .rc-pd .rc-accordion .p-accordion-toggle-icon {
          color: #b08d3e !important;
        }

        .rc-pd .rc-accordion .p-accordion-content {
          border: none !important;
          background: transparent !important;
          padding: 0 0 1.25rem 0 !important;
          color: #6e6a62;
          font-size: 0.92rem;
          line-height: 1.7;
        }

        .rc-pd .rc-scroll {
  scrollbar-width: none;
}
.rc-pd .rc-scroll::-webkit-scrollbar {
  display: none;
}
      `}</style>

      <Toast ref={toast} />

      <div className="tw:mx-auto tw:max-w-6xl tw:px-4 tw:py-6 tw:sm:px-6 tw:lg:px-8 tw:lg:py-10">
        {/* =====================================================
            Breadcrumb
        ===================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="tw:mb-6 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-xs tw:text-[#6e6a62] tw:lg:justify-start"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="tw:cursor-pointer tw:bg-transparent tw:p-0 tw:transition-colors tw:hover:text-[#1c1c1a]"
          >
            Home
          </button>

          <span aria-hidden="true" className="tw:text-[#b08d3e]">
            /
          </span>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="tw:cursor-pointer tw:bg-transparent tw:p-0 tw:font-medium tw:text-[#1c1c1a] tw:underline tw:decoration-[#b08d3e] tw:underline-offset-4"
          >
            All Jewellery
          </button>

          <span aria-hidden="true" className="tw:text-[#b08d3e]">
            /
          </span>

          <span className="tw:max-w-[180px] tw:truncate tw:text-[#6e6a62]">
            {productName}
          </span>
        </nav>

        <div className="tw:grid tw:grid-cols-1 tw:gap-8 tw:lg:grid-cols-[88px_minmax(0,1fr)_minmax(0,1fr)] tw:lg:gap-10">
          {/* ===================================================
              Desktop thumbnails
          =================================================== */}

          <div className="tw:order-2 tw:hidden tw:flex-col tw:gap-3 tw:lg:order-1 tw:lg:flex">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => goToImage(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={safeActiveImage === i}
                className={`rc-thumb tw:h-[86px] tw:w-[86px] tw:shrink-0 ${
                  safeActiveImage === i ? "rc-thumb-active" : ""
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="tw:h-full tw:w-full tw:object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* ===================================================
              Main image
          =================================================== */}

          <div className="tw:order-1 tw:lg:order-2">
            <div className="tw:relative tw:aspect-[4/5] tw:w-full tw:overflow-hidden tw:rounded-md tw:bg-[#e4eee2] tw:sm:aspect-square tw:lg:aspect-[4/5]">
              {images.length > 0 ? (
                <div
                  ref={sliderRef}
                  onScroll={handleScroll}
                  className="rc-scroll tw:flex tw:h-full tw:w-full tw:snap-x tw:snap-mandatory tw:overflow-x-auto"
                >
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={productName}
                      className="tw:h-full tw:w-full tw:shrink-0 tw:snap-center tw:object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:text-sm tw:text-[#6e6a62]">
                  No image available
                </div>
              )}

              <Button
                icon={wishlisted ? "pi pi-heart-fill" : "pi pi-heart"}
                rounded
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((value) => !value)}
                className="rc-wishlist tw:absolute tw:right-4 tw:top-4 tw:h-10 tw:w-10"
              />

              <Tag
                value={craftLabel}
                className="rc-tag-craft tw:absolute tw:bottom-4 tw:left-4 tw:!hidden tw:sm:!flex"
              />
            </div>

            {/* Mobile thumbnails */}

            {images.length > 1 && (
              <div className="tw:mt-3 tw:flex tw:gap-3 tw:overflow-x-auto tw:pb-1 tw:lg:hidden">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => goToImage(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={safeActiveImage === i}
                    className={`rc-thumb tw:h-16 tw:w-16 tw:shrink-0 ${
                      safeActiveImage === i ? "rc-thumb-active" : ""
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="tw:h-full tw:w-full tw:object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===================================================
              Product information
          =================================================== */}

          <div className="tw:order-3 tw:flex tw:flex-col">
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
              <span className="tw:text-xs tw:font-medium tw:tracking-[0.04em] tw:text-[#6e6a62]">
                {categoryName}
              </span>

              {product.badge === "BESTSELLER" && (
                <Tag
                  value="Bestseller"
                  icon="pi pi-star-fill"
                  className="rc-tag-bestseller"
                />
              )}
            </div>

            <h1 className="rc-serif tw:mt-2 tw:text-xl tw:font-semibold tw:leading-tight tw:text-[#1c1c1a] tw:sm:text-3xl">
              {productName}
            </h1>

            <div
              className="tw:mt-3 tw:h-px tw:w-14 tw:bg-[#b08d3e]"
              aria-hidden="true"
            />

            {/* =================================================
                Price
            ================================================= */}

            <div className="tw:mt-6 tw:border-t-2 tw:border-[#b08d3e] tw:bg-white tw:p-2 tw:sm:p-5 tw:shadow-[0_1px_3px_rgba(28,28,26,0.06)]">
              <div className="tw:flex tw:flex-wrap tw:items-baseline tw:gap-3">
                <span className="rc-serif tw:text-3xl tw:font-semibold tw:text-[#1c1c1a]">
                  {formatINR(price)}
                </span>

                {compareAtPrice > price && (
                  <span className="tw:text-base tw:text-[#6e6a62] tw:line-through">
                    {formatINR(compareAtPrice)}
                  </span>
                )}

                {savedAmount > 0 && (
                  <Tag
                    value={`Save ${formatINR(
                      savedAmount,
                    )} · ${discountPct}% off`}
                    className="rc-tag-save"
                  />
                )}
              </div>

              <p className="tw:mt-2 tw:text-xs tw:text-[#6e6a62]">
                Inclusive of all taxes. Free insured shipping on this piece.
              </p>
            </div>

            {/* =================================================
                Quantity
            ================================================= */}

            <div className="tw:mt-6 tw:flex tw:flex-wrap tw:items-center tw:gap-4">
              <span className="tw:text-sm tw:font-medium tw:text-[#1c1c1a]">
                Quantity
              </span>

              <div className="tw:flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-[#e7e1d5] tw:bg-white tw:px-1.5 tw:py-1.5">
                <Button
                  icon="pi pi-minus"
                  text
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="rc-qty-btn tw:h-8 tw:w-8"
                />

                <InputNumber
                  value={isOutOfStock ? 0 : quantity}
                  onValueChange={(e) => handleQuantityChange(e.value)}
                  disabled={isOutOfStock}
                  inputClassName="rc-qty-input"
                  className="rc-qty-input"
                  showButtons={false}
                  min={1}
                  max={stockLeft}
                  useGrouping={false}
                  inputStyle={{
                    width: "2.25rem",
                  }}
                  aria-label="Quantity"
                />

                <Button
                  icon="pi pi-plus"
                  text
                  disabled={isOutOfStock || quantity >= stockLeft}
                  onClick={() => setQuantity((q) => Math.min(stockLeft, q + 1))}
                  aria-label="Increase quantity"
                  className="rc-qty-btn tw:h-8 tw:w-8"
                />
              </div>

              {isOutOfStock ? (
                <Tag
                  value="Out of stock"
                  severity="danger"
                  className="tw:rounded-full"
                />
              ) : (
                <Tag
                  value={`Only ${stockLeft} left in stock`}
                  className="rc-tag-stock"
                />
              )}
            </div>

            {/* =================================================
                Add to cart
            ================================================= */}

            <div className="tw:mt-7 tw:flex tw:flex-col tw:gap-3">
              <Button
                label={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                icon="pi pi-shopping-bag"
                disabled={isOutOfStock}
                className="rc-btn-primary tw:h-12 tw:w-full tw:rounded-sm tw:text-sm"
                onClick={handleAddToCart}
              />
            </div>

            {/* =================================================
                Trust row
            ================================================= */}

            <div className="tw:mt-6 tw:grid tw:grid-cols-2 tw:gap-3">
              <div className="tw:flex tw:items-center tw:gap-2.5 tw:rounded-sm tw:border tw:border-[#e7e1d5] tw:bg-white tw:px-3 tw:py-2.5">
                <span className="tw:flex tw:h-7 tw:w-7 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#e4eee2]">
                  <i
                    className="pi pi-shield tw:text-[0.8rem] tw:text-[#2f5233]"
                    aria-hidden="true"
                  />
                </span>

                <span className="tw:text-[0.8rem] tw:font-medium tw:text-[#1c1c1a]">
                  100% safe payments
                </span>
              </div>

              <div className="tw:flex tw:items-center tw:gap-2.5 tw:rounded-sm tw:border tw:border-[#e7e1d5] tw:bg-white tw:px-3 tw:py-2.5">
                <span className="tw:flex tw:h-7 tw:w-7 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#e4eee2]">
                  <i
                    className="pi pi-box tw:text-[0.8rem] tw:text-[#2f5233]"
                    aria-hidden="true"
                  />
                </span>

                <span className="tw:text-[0.8rem] tw:font-medium tw:text-[#1c1c1a]">
                  Velvet gift box packaging
                </span>
              </div>
            </div>

            {/* =================================================
                Details accordion
            ================================================= */}

            <Accordion
              multiple
              className="rc-accordion tw:mt-7 tw:border-t tw:border-[#e7e1d5]"
            >
              <AccordionTab header="Product details & specifications">
                <p>{productDetails}</p>
              </AccordionTab>

              <AccordionTab header="Material & care instructions">
                <p>{productCare}</p>
              </AccordionTab>

              <AccordionTab header="Shipping & returns">
                <p>{productShipping}</p>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
