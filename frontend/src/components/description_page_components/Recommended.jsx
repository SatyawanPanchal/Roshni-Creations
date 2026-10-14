/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom"; // changed (no more useLocation)

import { useProducts } from "../../context/productContext";
import ProductCard from "../jewellery_page_components/ProductCard";
import { useCart } from "../../context/CartContext";

const getCategoryKey = (category) => {
  if (!category) return "";
  if (typeof category === "string") return category.toLowerCase();
  return String(
    category._id || category.name || category.title || "",
  ).toLowerCase();
};

export default function Recommended() {
  const { products } = useProducts();
  const { id: productId } = useParams(); // gets the id from the URL
  const { cartItems } = useCart();
  const location = useLocation();

  const recommendedProducts = useMemo(() => {
    if (!products?.length) return [];

    const currentProduct = products.find(
      (p) => String(p._id || p.id) === String(productId),
    );

    // products that can be shown (not current, not out of stock)
    const others = products.filter(
      (p) =>
        String(p._id || p.id) !== String(productId) &&
        p.availability !== "out-of-stock",
    );

    // no current product (e.g. other pages) -> just show some products
    if (!currentProduct) return others.slice(0, 4);

    const currentCategory = getCategoryKey(currentProduct.category);

    const sameCategory = others.filter(
      (p) => getCategoryKey(p.category) === currentCategory,
    );

    const different = others.filter(
      (p) => getCategoryKey(p.category) !== currentCategory,
    );
    console.log(currentProduct?.category);

    // same category first, then fill remaining slots with others
    return [...sameCategory, ...different].slice(0, 4);
  }, [products, productId]);

  // ============================================================
  // NO PRODUCTS
  // ============================================================

  if (!recommendedProducts.length) {
    return null;
  }

  return (
    <section className="tw:bg-neutral-50 tw:px-4 tw:sm:px-8 tw:lg:px-16 tw:py-10 tw:sm:py-14">
      <div className="tw:mx-auto tw:max-w-7xl">
        {/* Header */}
        <div className="tw:flex tw:items-baseline tw:justify-between tw:gap-4">
          <h2 className="tw:font-serif tw:text-3xl tw:sm:text-4xl tw:lg:text-5xl tw:text-gray-900">
            You May Also Like
          </h2>

          <a
            href="/shop"
            className="tw:flex tw:shrink-0 tw:items-center tw:gap-1.5 tw:text-sm tw:sm:text-base tw:font-medium tw:text-teal-800 tw:transition-colors tw:hover:text-teal-900"
          >
            View All
            <svg
              className="tw:h-4 tw:w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <hr className="tw:mt-4 tw:mb-8 tw:sm:mb-10 tw:border-gray-200" />

        {/* Products */}
        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-4 tw:gap-x-6 tw:gap-y-10">
          {recommendedProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
