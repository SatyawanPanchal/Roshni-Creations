/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import ProductCard from "../jewellery_page_components/ProductCard";

import { useMemo } from "react";
import { useProducts } from "../../context/productContext";
import ProductCardCopy from "../jewellery_page_components/ProductCardCopy";

export default function LatestJewellery() {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProducts();
  

  // Get the 4 newest products from the main product data
  const latestProducts = useMemo(() => {
    return products.filter((product) => product.badge === "NEW").slice(0, 3);
  }, [products]);

  return (
    <section
      id="LatestJewellery"
      className="tw:bg-neutral-50 tw:px-4 tw:sm:px-8 tw:lg:px-16 tw:py-10 tw:sm:py-14"
    >
      {/* Scoped plain CSS — same pattern as Bestsellers/Trending. Avoids
          relying on Tailwind's prefix/arbitrary-value handling for the
          flex<->grid breakpoint switch, so it works regardless of config. */}
      <style>{`
  #LatestJewellery .rc-scroll-row {
   display: flex;
          gap: 1rem;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 1rem;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
  }

  #LatestJewellery .rc-scroll-row::-webkit-scrollbar {
    height: 6px;
  }

  #LatestJewellery .rc-scroll-row::-webkit-scrollbar-thumb {
   background: #d6d3d1;
          border-radius: 3px;
  }

  #LatestJewellery .rc-scroll-item {
    flex: 0 0 46%;
          min-width: 46%;
          scroll-snap-align: start;
  }

  @media (min-width: 640px) {
    #LatestJewellery .rc-scroll-row {
      display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 1.5rem;
            row-gap: 2.5rem;
            overflow: visible;
            padding-bottom: 0;
    }

    #LatestJewellery .rc-scroll-item {
      flex: unset;
      min-width: 0;
    }
  }

  @media (min-width: 1024px) {
    #LatestJewellery .rc-scroll-row {
      grid-template-columns: repeat(3, 1fr);
      column-gap: 2rem;
      row-gap: 3rem;
    }
  }
`}</style>

      <div className="tw:mx-auto tw:max-w-7xl">
        {/* Header */}
        <div className="tw:flex tw:items-baseline tw:justify-between tw:gap-4">
          <h2 className="tw:font-serif tw:text-3xl tw:sm:text-4xl tw:lg:text-5xl tw:text-gray-900">
            Latest Jewellery
          </h2>

          <button
            onClick={() => navigate("/products?badge=new")}
            className="
    tw:flex
    tw:shrink-0
    tw:items-center
    tw:gap-1.5
    tw:text-sm
    tw:sm:text-base
    tw:font-medium
    tw:text-teal-800
    tw:cursor-pointer
    tw:transition-all
    tw:duration-300
    tw:ease-out
    tw:hover:text-teal-900
    tw:group
  "
          >
            View All
            <svg
              className="
      tw:h-4
      tw:w-4
      tw:transition-transform
      tw:duration-300
      tw:ease-out
      tw:group-hover:translate-x-1
    "
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
          </button>
        </div>

        {/* Divider */}
        <hr className="tw:mt-4 tw:mb-8 tw:sm:mb-10 tw:border-gray-200" />

        {/* Mobile: horizontal snap-scroll. sm+: grid, matching your original. */}
        <div className="rc-scroll-row">
          {latestProducts.map((product) => (
            <div key={product.id} className="rc-scroll-item">
              <ProductCardCopy product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
