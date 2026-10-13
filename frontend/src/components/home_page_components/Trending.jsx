import { useNavigate } from "react-router-dom";
import ProductCard from "../jewellery_page_components/ProductCard";
import { useProducts } from "../../context/productContext";

export default function Trending() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const trendingProducts = products
    .filter((product) => product.badge === "TRENDING")
    .slice(0, 3);
  return (
    <section
      id="Trending"
      className="tw:w-full tw:max-w-full tw:bg-neutral-50 tw:px-4 tw:sm:px-8 tw:lg:px-16 tw:py-10 tw:sm:py-14"
    >
      {/* Scoped plain CSS — avoids relying on Tailwind's prefix/arbitrary-value
          handling for the flex<->grid breakpoint switch, so it works regardless
          of Tailwind version/config. */}
      <style>{`
        #Trending .rc-scroll-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  min-width: 0;
  max-width: 100%;
}
        #Trending .rc-scroll-row::-webkit-scrollbar { height: 6px; }
        #Trending .rc-scroll-row::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 3px;
        }
        #Trending .rc-scroll-item {
          flex: 0 0 46%;
          min-width: 46%;
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          #Trending .rc-scroll-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 1.5rem;
            row-gap: 2.5rem;
            overflow: visible;
            padding-bottom: 0;
          }
          #Trending .rc-scroll-item { flex: unset; min-width: 0; }
        }
        @media (min-width: 1024px) {
          #Trending .rc-scroll-row { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-7xl">
        {/* Header */}
        <div className="tw:flex tw:items-baseline tw:justify-between tw:gap-4">
          <h2 className="tw:font-serif tw:text-3xl tw:sm:text-4xl tw:lg:text-5xl tw:text-gray-900">
            Trending
          </h2>
          <button
            onClick={() => navigate("/products?badge=trending")}
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
          </button>{" "}
        </div>

        {/* Divider */}
        <hr className="tw:mt-4 tw:mb-8 tw:sm:mb-10 tw:border-gray-200" />

        {/* Mobile: horizontal snap-scroll. sm+: grid, matching your original. */}
        <div className="rc-scroll-row">
          {trendingProducts.map((product) => (
            <div key={product.id} className="rc-scroll-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
