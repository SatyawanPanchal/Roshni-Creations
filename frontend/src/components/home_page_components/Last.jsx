import ProductCard from "../ProductCard";

import product1 from "../../images/newArrivals/newarrival1.png";
import product2 from "../../images/newArrivals/newarrival2.png";
import product3 from "../../images/newArrivals/newarrival3.png";
import product4 from "../../images/newArrivals/newarrival4.png";

const Last = () => {
  const products = [
    {
      id: 1,
      image: product1,
      name: "Pink Fabric Jewellery",
      price: 600,
    },
    {
      id: 2,
      image: product2,
      name: "Shining Moon Mangalsutra",
      price: 120,
    },
    {
      id: 3,
      image: product3,
      name: "Resin Leaf Earrings",
      price: 100,
    },
    {
      id: 4,
      image: product4,
      name: "Kundan and Beads Necklace Set",
      price: 1280,
    },
  ];

  return (
    <section className="tw:py-6 tw:md:py-8">
      <div
        className="
          tw:w-full
          tw:max-w-330
          tw:mx-auto
          tw:flex
          tw:flex-col
          tw:px-4
          tw:sm:px-6
          tw:md:px-8
          tw:lg:px-0
        "
      >
        {/* Header */}
        <div
          className="
            tw:flex
            tw:items-center
            tw:justify-between
            tw:mb-0
            tw:md:mb-4
          "
        >
          <h2
            className="
              tw:m-0
              tw:text-[18px]
              tw:lg:text-[36px]
              tw:font-normal
              tw:leading-[1.2]
              tw:text-[#191C1B]
              tw:font-[heading]
            "
          >
            Latest Products
          </h2>

          <button
            type="button"
            className="
    tw:group
    tw:flex
    tw:items-center
    tw:gap-2
    tw:border-none
    tw:bg-transparent
    tw:p-0
    tw:outline-none
    tw:cursor-pointer
    tw:text-[16px]
    tw:font-normal
    tw:text-[#006f68]
    tw:!transition-all
    tw:!duration-500
    tw:!ease-out
  "
          >
            <span
              className="
      tw:font-[Manrope]
      tw:!text-[#19665A]
      tw:text-[14px]
      tw:md:text-[17px]
      tw:!transition-all
      tw:!duration-500
      tw:!ease-out
      tw:group-hover:translate-x-1
    "
            >
              View All
            </span>

            <span
              className="
      tw:text-[14px]
      tw:md:text-[18px]
      tw:leading-none
      tw:!text-[#19665A]
      tw:transition-transform
      tw:duration-500
      tw:ease-out
      tw:group-hover:translate-x-1
    "
            >
              →
            </span>
          </button>
        </div>

        <hr className="tw:border-[#BEC9C5]" />

        {/* Product Grid / Horizontal Scroll on mobile & tablet */}
        <div
          className="
            tw:flex
            tw:overflow-x-auto
            tw:gap-4
            tw:pb-2
            tw:mt-5
            tw:-mx-4
            tw:px-4
            tw:sm:mx-0
            tw:sm:px-0
            tw:snap-x
            tw:snap-mandatory
            tw:[-webkit-overflow-scrolling:touch]
            tw:[scrollbar-width:none]
            tw:[&::-webkit-scrollbar]:hidden

            tw:md:grid
            tw:md:grid-cols-4
            tw:md:gap-x-5
            tw:md:overflow-visible
            tw:md:pb-0
            tw:md:mx-0
            tw:md:px-0
            tw:md:mt-14
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                tw:shrink-0
                tw:w-[68%]
                tw:sm:w-[38%]
                tw:snap-start

                tw:md:w-auto
                tw:md:shrink
                tw:md:snap-align-none
              "
            >
              <ProductCard
                id={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Last;