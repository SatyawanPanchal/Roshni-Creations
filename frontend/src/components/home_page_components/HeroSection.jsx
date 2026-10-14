import { Galleria } from "primereact/galleria";
import { useNavigate } from "react-router-dom";

import hero1 from "../../images/hero/hero1.webp";
import hero1Mobile from "../../images/hero/hero1_mobile.webp";

import hero2 from "../../images/hero/hero2.webp";
import hero2Mobile from "../../images/hero/hero2_mobile.webp";

import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const heroImages = [
    {
      desktop: hero1,
      mobile: hero1Mobile,
      alt: "Roshni Creations Hero 1",
    },
    {
      desktop: hero2,
      mobile: hero2Mobile,
      alt: "Roshni Creations Hero 2",
    },
  ];

  const itemTemplate = (item) => {
    return (
      <picture
        className="tw:block tw:w-full tw:h-full"
        onClick={() => navigate("/products")}
      >
        {/* Mobile image */}
        <source media="(max-width: 767px)" srcSet={item.mobile} />

        {/* Desktop / tablet image */}
        <img
          src={item.desktop}
          alt={item.alt}
          className="
  tw:w-full
  tw:h-130
  tw:sm:h-120
  tw:md:h-140
  tw:lg:h-160
  tw:object-cover
  tw:block
"
        />
      </picture>
    );
  };

  return (
    <div className="tw:hidden tw:lg:flex tw:relative tw:w-full tw:mb-8">
      <section className="tw:w-full tw:overflow-hidden tw:cursor-pointer">
        <Galleria
          value={heroImages}
          item={itemTemplate}
          showThumbnails={false}
          showIndicators={false}
          showIndicatorsOnItem={false}
          showItemNavigators={false}
          showItemNavigatorsOnHover={false}
          autoPlay
          circular
          transitionInterval={5000}
          transitionOptions={{
            timeout: 1200,
            classNames: "p-galleria-item",
          }}
          className="
            tw:w-full
            tw:h-130
            tw:sm:h-120
            tw:md:h-140
            tw:lg:h-160
          "
        />
      </section>

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="
    shop-pill-shine
    tw:absolute
    tw:left-1/2
    tw:-bottom-6
    tw:-translate-x-1/2
    tw:z-10
    tw:inline-flex
    tw:items-center
    tw:gap-2
    tw:h-12
    tw:px-6
    tw:rounded-full
    tw:border-2
    tw:border-white
    tw:bg-[#c9a45c]
    tw:text-[#123b30]
    tw:text-[15px]
    tw:font-semibold
    tw:whitespace-nowrap
    tw:shadow-lg
    tw:cursor-pointer
    tw:active:scale-95
  "
      >
        Shop all products{" "}
        <span className="shop-pill-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
};

export default HeroSection;
