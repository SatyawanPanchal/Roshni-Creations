/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import ProductCard from "../jewellery_page_components/ProductCard";

import { useMemo } from "react";
import { useProducts } from "../../context/productContext";
import ProductCardCopy from "../jewellery_page_components/ProductCardCopy";
import { Button } from "primereact/button";

export default function LatestJewellery() {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProducts();

  // Get the newest products from the main product data
  const latestProducts = useMemo(() => {
    return products.filter((product) => product.badge === "NEW").slice(0, 40);
  }, [products]);

  return (
    <section
      id="LatestJewellery"
      className="tw:w-full tw:max-w-full tw:bg-neutral-50 tw:px-4 tw:sm:px-8 tw:lg:px-16 tw:py-10 tw:sm:py-14"
    >
      {/* Scoped plain CSS — same pattern as Bestsellers/Trending. Avoids
          relying on Tailwind's prefix/arbitrary-value handling for the
          flex<->grid breakpoint switch, so it works regardless of config. */}

      <style>{`
  #LatestJewellery {
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
  }

  #LatestJewellery .rc-scroll-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 12px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  #LatestJewellery .rc-scroll-item {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }

  #LatestJewellery .rc-scroll-item img {
    max-width: 100%;
    height: auto;
  }

  @media screen and (min-width: 640px) {
    #LatestJewellery .rc-scroll-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 24px;
      row-gap: 40px;
    }
  }

  @media screen and (min-width: 1024px) {
    #LatestJewellery .rc-scroll-row {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      column-gap: 32px;
      row-gap: 48px;
    }
  }
`}</style>

      <div className="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-7xl">
        {/* Header */}
        <div className="tw:flex tw:items-baseline tw:justify-between tw:gap-4">
          <h2 className="tw:font-serif tw:text-2xl tw:sm:text-4xl tw:lg:text-5xl tw:text-gray-900">
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

      <div className="tw:mt-8 tw:flex tw:justify-center tw:w-full">
        <Button
          label="Show All"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => navigate("/products")}
          className="tw:rounded-none tw:!bg-[#23392c] tw:px-6 tw:py-3 tw:text-white tw:transition-colors tw:hover:!bg-[#182a1f] tw:!border-[#182a1f]"
        />
      </div>
    </section>
  );
}
