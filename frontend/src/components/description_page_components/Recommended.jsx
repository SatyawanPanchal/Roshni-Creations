import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useProducts } from "../../context/productContext";
import { useCart } from "../../context/CartContext";

import ProductCard from "../jewellery_page_components/ProductCard";

export default function Recommended() {
  const { products } = useProducts();
  const { cartItems } = useCart();
  const location = useLocation();

  const recommendedProducts = useMemo(() => {
    if (!products?.length) {
      return [];
    }

    // ============================================================
    // FIND SOURCE PRODUCTS
    // ============================================================

    let sourceProducts = [];

    /*
     * ------------------------------------------------------------
     * PRODUCT DESCRIPTION PAGE
     *
     * Example:
     * /products/6ab35e9...
     * ------------------------------------------------------------
     */

    if (location.pathname.includes("/products/")) {
      const productId = location.pathname.split("/products/")[1];

      const currentProduct = products.find(
        (product) => String(product._id || product.id) === String(productId),
      );

      if (currentProduct) {
        sourceProducts = [currentProduct];
      }
    } else if (location.pathname.includes("/checkout")) {

    /*
     * ------------------------------------------------------------
     * CHECKOUT PAGE
     *
     * Use products currently inside the cart.
     * ------------------------------------------------------------
     */
      sourceProducts = cartItems
        ?.map((cartItem) => {
          const productId = cartItem.productId || cartItem.id;

          return products.find(
            (product) =>
              String(product._id || product.id) === String(productId),
          );
        })
        .filter(Boolean);
    } else if (

    /*
     * ------------------------------------------------------------
     * ORDER CONFIRMATION
     *
     * Read the last order saved in localStorage.
     * ------------------------------------------------------------
     */
      location.pathname.includes("/orderConfirmed") ||
      location.pathname.includes("/order-confirmation")
    ) {
      try {
        const savedOrder = localStorage.getItem("roshni_last_order");

        if (savedOrder) {
          const lastOrder = JSON.parse(savedOrder);

          sourceProducts =
            lastOrder?.items
              ?.map((item) => {
                const productId =
                  item.productId || item.product?._id || item.product?.id;

                return products.find(
                  (product) =>
                    String(product._id || product.id) === String(productId),
                );
              })
              .filter(Boolean) || [];
        }
      } catch (error) {
        console.error("Failed to read last order:", error);
      }
    }

    /*
     * ============================================================
     * NO SOURCE PRODUCT
     * ============================================================
     *
     * If there is no current product/cart/order,
     * simply show available products.
     */

    if (!sourceProducts.length) {
      return products
        .filter((product) => product.availability !== "out-of-stock")
        .slice(0, 4);
    }

    // IDs of products already being used as recommendation source
    const sourceIds = new Set(
      sourceProducts.map((product) => String(product._id || product.id)),
    );

    /*
     * ============================================================
     * SCORE PRODUCTS
     * ============================================================
     */

    const scoredProducts = products
      .filter(
        (product) =>
          !sourceIds.has(String(product._id || product.id)) &&
          product.availability !== "out-of-stock",
      )
      .map((product) => {
        let score = 0;

        /*
         * Compare this product against every source product.
         *
         * Example:
         *
         * Cart:
         * - Jhumka
         * - Necklace
         *
         * A product matching both gets a higher score.
         */

        sourceProducts.forEach((sourceProduct) => {
          // ------------------------------------------------------
          // SAME CATEGORY
          // ------------------------------------------------------

          if (
            product.category &&
            sourceProduct.category &&
            String(product.category).toLowerCase() ===
              String(sourceProduct.category).toLowerCase()
          ) {
            score += 5;
          }

          // ------------------------------------------------------
          // SAME SUBCATEGORY
          // ------------------------------------------------------

          if (
            product.subcategory &&
            sourceProduct.subcategory &&
            String(product.subcategory).toLowerCase() ===
              String(sourceProduct.subcategory).toLowerCase()
          ) {
            score += 4;
          }

          // ------------------------------------------------------
          // SAME MATERIAL
          // ------------------------------------------------------

          if (
            product.material &&
            sourceProduct.material &&
            String(product.material).toLowerCase() ===
              String(sourceProduct.material).toLowerCase()
          ) {
            score += 2;
          }

          // ------------------------------------------------------
          // SAME COLLECTION
          // ------------------------------------------------------

          if (
            Array.isArray(product.collections) &&
            Array.isArray(sourceProduct.collections)
          ) {
            const sharedCollections = product.collections.filter((collection) =>
              sourceProduct.collections.some(
                (sourceCollection) =>
                  String(collection).toLowerCase() ===
                  String(sourceCollection).toLowerCase(),
              ),
            );

            score += sharedCollections.length * 3;
          }
        });

        return {
          product,
          score,
        };
      });

    /*
     * ============================================================
     * SORT BY RELEVANCE
     * ============================================================
     */

    scoredProducts.sort((a, b) => {
      return b.score - a.score;
    });

    /*
     * ============================================================
     * TAKE RELATED PRODUCTS
     * ============================================================
     */

    const recommended = scoredProducts
      .filter((item) => item.score > 0)
      .slice(0, 4)
      .map((item) => item.product);

    /*
     * ============================================================
     * FALLBACK
     * ============================================================
     *
     * If there aren't enough related products,
     * fill the remaining slots with other products.
     */

    if (recommended.length < 4) {
      const usedIds = new Set([
        ...sourceIds,
        ...recommended.map((product) => String(product._id || product.id)),
      ]);

      const fallbackProducts = products
        .filter(
          (product) =>
            !usedIds.has(String(product._id || product.id)) &&
            product.availability !== "out-of-stock",
        )
        .slice(0, 4 - recommended.length);

      return [...recommended, ...fallbackProducts];
    }

    return recommended;
  }, [products, cartItems, location.pathname]);

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
