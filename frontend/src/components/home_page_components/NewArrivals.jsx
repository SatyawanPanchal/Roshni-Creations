/**
 * NewArrivals — "Latest Jewellery" product strip
 *
 * Tailwind is configured with the `tw:` prefix in this project, so every
 * utility class below is written as `tw:<utility>`.
 *
 * Desktop / tablet : responsive grid (2 / 3 / 4 columns)
 * Mobile           : horizontal scroll-snap carousel
 * Hover            : image zoom + "Quick View" button + top-right bag button
 *
 * Drop your own product data in via the `products` prop, or edit the
 * `defaultProducts` array below.
 */

import product1 from "../../images/newArrivals/newarrival1.png";
import product2 from "../../images/newArrivals/newarrival2.png";
import product3 from "../../images/newArrivals/newarrival3.png";
import product4 from "../../images/newArrivals/newarrival4.png";

const defaultProducts = [
  {
    id: 1,
    name: "Pink Fabric Jewellery",
    price: 600,
    image: product1,
  },
  {
    id: 2,
    name: "Shining Moon Mangalsutra",
    price: 120,
    image: product2,
  },
  {
    id: 3,
    name: "Resin Leaf Earrings",
    price: 100,
    image: product3,
  },
  {
    id: 4,
    name: "Kundan and Beads Necklace Set",
    price: 1280,
    image: product4,
  },
];

function BagIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function EyeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ProductCard({ product, onQuickView, onAddToBag }) {
  return (
    <div
      className="
        tw:group tw:relative tw:flex tw:flex-col
        tw:w-[72vw] tw:shrink-0 tw:snap-start
        tw:sm:w-auto tw:sm:shrink tw:sm:snap-none
      "
    >
      <div className="tw:relative tw:overflow-hidden tw:rounded-sm tw:bg-[#f1ece4] tw:aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="
            tw:h-full tw:w-full tw:object-cover
            tw:transition-transform tw:duration-500 tw:ease-out
            tw:group-hover:scale-105
          "
          loading="lazy"
        />

        {/* soft scrim that appears on hover, anchored to the bottom so the
            Quick View button has contrast without darkening the product */}
        <div
          className="
            tw:pointer-events-none tw:absolute tw:inset-x-0 tw:bottom-0 tw:h-1/2
            tw:bg-gradient-to-t tw:from-black/35 tw:to-transparent
            tw:opacity-0 tw:transition-opacity tw:duration-300
            tw:group-opahover:city-100
          "
        />

        {/* bag button, top right */}
        <button
          type="button"
          onClick={() => onAddToBag?.(product)}
          aria-label={`Add ${product.name} to bag`}
          className="
            tw:absolute tw:right-3 tw:top-3
            tw:flex tw:h-9 tw:w-9 tw:items-center tw:justify-center
            tw:rounded-full tw:bg-white/90 tw:text-[#1f2a24]
            tw:shadow-sm tw:backdrop-blur-sm
            tw:opacity-0 tw:translate-y-1
            tw:transition-all tw:duration-300
            tw:group-opahover:city-100 tw:group-trahover:nslate-y-0
            tw:hover:bg-white
            tw:focus-visible:opacity-100 tw:focus-visible:outline tw:focus-visible:outline-2 tw:focus-visible:outline-[#1f6f63]
          "
        >
          <BagIcon className="tw:h-4 tw:w-4" />
        </button>

        {/* quick view, bottom center */}
        <button
          type="button"
          onClick={() => onQuickView?.(product)}
          className="
            tw:absolute tw:inset-x-3 tw:bottom-3
            tw:flex tw:items-center tw:justify-center tw:gap-2
            tw:rounded-sm tw:bg-white/95 tw:py-2.5
            tw:text-xs tw:tracking-wide tw:text-[#1f2a24]
            tw:opacity-0 tw:translate-y-2
            tw:transition-all tw:duration-300
            tw:group-opahover:city-100 tw:group-trahover:nslate-y-0
            tw:hover:bg-white
            tw:focus-visible:opacity-100 tw:focus-visible:translate-y-0 tw:focus-visible:outline tw:focus-visible:outline-2 tw:focus-visible:outline-[#1f6f63]
          "
        >
          <EyeIcon className="tw:h-3.5 tw:w-3.5" />
          Quick view
        </button>
      </div>

      <h3 className="tw:mt-4 tw:text-[15px] tw:text-[#26241f]">
        {product.name}
      </h3>
      <p className="tw:mt-1 tw:text-[15px] tw:font-medium tw:text-[#1f6f63]">
        ₹ {product.price.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function NewArrivals({
  products = defaultProducts,
  onQuickView,
  onAddToBag,
  onViewAll,
}) {
  return (
    <section className="tw:bg-[#faf8f4] tw:px-5 tw:py-10 tw:sm:px-8 tw:sm:py-14 tw:lg:px-16">
      <div className="tw:mx-auto tw:max-w-[1440px]">
        <div className="tw:flex tw:items-end tw:justify-between tw:border-b tw:border-[#e7e2d8] tw:pb-4">
          <h2 className="tw:font-serif tw:text-3xl tw:text-[#1f1d19] tw:sm:text-4xl">
            Latest Jewellery
          </h2>
          <button
            type="button"
            onClick={onViewAll}
            className="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-[#1f6f63] tw:transition-colors tw:hover:text-[#154f46]"
          >
            View All
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* mobile: horizontal snap-scroll strip · sm+: responsive grid */}
        <div
          className="
            tw:mt-8 tw:flex tw:gap-4 tw:overflow-x-auto tw:pb-2
            tw:snap-x tw:snap-mandatory
            tw:[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            tw:sm:grid tw:sm:grid-cols-2 tw:sm:gap-6 tw:sm:overflow-visible tw:sm:pb-0
            tw:lg:grid-cols-4
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToBag={onAddToBag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
