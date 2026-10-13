/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

// Replace these with your actual category/editorial images.
import earringsImage from "../../images/categoryImages/earrings.png";
import necklacesImage from "../../images/categoryImages/necklaces.webp";
import braceletsImage from "../../images/categoryImages/jewellerySets.webp";
import resinImage from "../../images/categoryImages/resinJewellery.webp";
import fabricJewelleryImage from "../../images/categoryImages/fabricJewellery.webp";
import watchesImage from "../../images/categoryImages/kashmereWatch.webp";

import "./ShopByCollection.css";
import { useNavigate } from "react-router-dom";

/**
 * Roshni brand palette
 *
 * These values are intentionally derived from the supplied logo,
 * NOT from the pink/beige reference image.
 */
const ROSHNI_COLORS = {
  ivory: "#F8F4EC",
  pearl: "#FFFDF8",
  gold: "#BFA66A",
  goldDeep: "#96783D",
  peacockBlue: "#003B52",
  peacockGreen: "#126047",
  deepTeal: "#003F40",
  darkBlueGreen: "#002C35",
};

const categories = [
  {
    id: "earrings",
    letter: "R",
    title: "Earrings",
    image: earringsImage,
    alt: "Elegant Indian woman wearing handcrafted earrings",
    url: "/products/subcategory/Earrings",
  },
  {
    id: "necklaces",
    letter: "O",
    title: "Necklaces",
    image: necklacesImage,
    alt: "Elegant Indian woman wearing a handcrafted necklace",
    url: "/products/subcategory/Necklaces",
  },
  {
    id: "jewellery sets",
    letter: "S",
    title: "Jewellery Sets",
    image: braceletsImage,
    alt: "Elegant Indian woman wearing handcrafted jewellery sets",
    url: "/products/category/jewellery%20sets",
  },
  {
    id: "resin jewellery",
    letter: "H",
    title: "Resin Jewellery",
    image: resinImage,
    alt: "Handcrafted resin jewellery with botanical details",
    url: "/products/category/resin%20jewellery",
  },
  {
    id: "fabric",
    letter: "N",
    title: "Fabric Jewellery",
    image: fabricJewelleryImage,
    alt: "Indian woman wearing handcrafted fabric jewellery",
    url: "/products/category/fabric%20jewellery",
  },
  {
    id: "watches",
    letter: "I",
    title: "Watches",
    image: watchesImage,
    alt: "Contemporary Indian woman wearing an elegant watch",
    url: "/products/category/kashmere%20watch",
  },
];

/**
 * Same-point-count polygon shapes.
 *
 * The initial shapes approximate the six letters.
 * The final state is a circular geometry.
 *
 * Because both states contain the same number of points,
 * the browser can interpolate the shape smoothly.
 */
const LETTER_SHAPES = {
  R: {
    normal: `
      8% 5%, 72% 5%, 82% 9%, 87% 18%,
      87% 29%, 82% 38%, 73% 43%,
      58% 45%, 58% 48%, 86% 91%,
      72% 95%, 48% 55%, 38% 55%,
      38% 95%, 8% 95%
    `,
  },

  O: {
    normal: `
      20% 5%, 80% 5%, 91% 16%, 95% 50%,
      91% 84%, 80% 95%, 20% 95%,
      9% 84%, 5% 50%, 9% 16%,
      30% 25%, 70% 25%, 76% 34%,
      78% 50%, 76% 66%, 70% 75%,
      30% 75%, 24% 66%, 22% 50%,
      24% 34%, 30% 25%
    `,
  },

  S: {
    normal: `
      88% 7%, 24% 7%, 14% 15%, 12% 28%,
      18% 38%, 45% 47%, 70% 55%, 78% 62%,
      76% 73%, 68% 80%, 12% 80%, 12% 94%,
      76% 94%, 88% 86%, 90% 71%, 84% 58%,
      58% 49%, 32% 41%, 24% 35%, 26% 25%,
      34% 20%, 88% 20%
    `,
  },

  H: {
    normal: `
      7% 5%, 32% 5%, 32% 42%, 68% 42%,
      68% 5%, 93% 5%, 93% 95%, 68% 95%,
      68% 57%, 32% 57%, 32% 95%, 7% 95%
    `,
  },

  N: {
    normal: `
      7% 5%, 34% 5%, 66% 61%, 66% 5%,
      93% 5%, 93% 95%, 66% 95%, 34% 39%,
      34% 95%, 7% 95%
    `,
  },

  I: {
    normal: `
      22% 5%, 78% 5%, 78% 22%, 64% 22%,
      64% 78%, 78% 78%, 78% 95%,
      22% 95%, 22% 78%, 36% 78%,
      36% 22%, 22% 22%
    `,
  },
};

const CIRCLE_SHAPE = `
  50% 0%,
  70% 4%,
  86% 14%,
  96% 30%,
  100% 50%,
  96% 70%,
  86% 86%,
  70% 96%,
  50% 100%,
  30% 96%,
  14% 86%,
  4% 70%,
  0% 50%,
  4% 30%,
  14% 14%,
  30% 4%
`;

/**
 * Reusable category component.
 */
const CategoryLetter = ({
  letter,
  title,
  image,
  alt,
  isActive,
  onActivate,
  onDeactivate,
  onClick,
}) => {
  const shape = LETTER_SHAPES[letter]?.normal ?? "";

  return (
    <article
      className={`
        category-letter
        tw:group
        tw:relative
        tw:flex
        tw:flex-col
        tw:items-center
        tw:shrink-0
        tw:outline-none
        ${isActive ? "category-letter--active" : ""}
      `}
      tabIndex={0}
      aria-label={`Explore ${title}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {/*
        Main editorial frame.

        The clip-path itself changes from the letter geometry
        to a circle. This is the actual image frame, rather
        than a circle being placed on top of the letter.
      */}
      <div
        className="
          category-letter__visual
          tw:relative
          tw:w-full
          tw:overflow-hidden
        "
        style={{
          "--letter-shape": `polygon(${shape})`,
          "--circle-shape": `polygon(${CIRCLE_SHAPE})`,
        }}
      >
        {/* Editorial image */}
        <img
          src={image}
          alt={alt}
          draggable="false"
          className="
            category-letter__image
            tw:absolute
            tw:inset-0
            tw:h-full
            tw:w-full
            tw:object-cover
          "
        />

        {/* Deep brand overlay */}
        <div
          aria-hidden="true"
          className="
            category-letter__tint
            tw:absolute
            tw:inset-0
            tw:pointer-events-none
          "
        />

        {/* Fine antique-gold frame */}
        <div
          aria-hidden="true"
          className="
            category-letter__frame
            tw:absolute
            tw:inset-0
            tw:pointer-events-none
          "
        />

        {/* Letter */}
        <span
          aria-hidden="true"
          className="
            category-letter__letter
            tw:absolute
            tw:inset-0
            tw:flex
            tw:items-center
            tw:justify-center
            tw:font-serif
            tw:select-none
            tw:pointer-events-none
          "
        >
          {letter}
        </span>

        {/* Explore indicator */}
        <span
          className="
            category-letter__explore
            tw:absolute
            tw:right-4
            tw:bottom-4
            tw:flex
            tw:h-9
            tw:w-9
            tw:items-center
            tw:justify-center
            tw:rounded-full
            tw:border
            tw:!border-[#F8F3E7]/70
            tw:!bg-[#FFFDF8]/10
            tw:!text-[#E2CA92]
            tw:backdrop-blur-sm
          "
          aria-hidden="true"
        >
          <ArrowUpRight size={15} strokeWidth={1.4} />
        </span>
      </div>

      {/* Category caption */}
      <div
        className="
          tw:mt-5
          tw:flex
          tw:flex-col
          tw:items-center
          tw:gap-2
        "
      >
        <span
          className="
            category-letter__title
            tw:text-center
            tw:font-serif
            tw:text-[13px]
            tw:font-normal
            tw:tracking-[0.22em]
            tw:uppercase
          "
        >
          {title}
        </span>

        <span
          aria-hidden="true"
          className="
            category-letter__line
            tw:h-px
            tw:w-10
          "
        />
      </div>
    </article>
  );
};

const ShopByCollection = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  return (
    <section
      className="
        shop-by-collection
        tw:hidden
        tw:sm:flex
        tw:relative
        tw:w-full
        tw:overflow-hidden
        tw:bg-[#08415A]
        tw:py-20
        tw:md:py-24
        tw:lg:py-28
      "
    >
      {/* Very subtle decorative background */}
      <div
        aria-hidden="true"
        className="
          tw:pointer-events-none
          tw:absolute
          tw:inset-0
          tw:opacity-[0.035]
        "
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 20% 20%,
              #003B52 0,
              transparent 28%
            ),
            radial-gradient(
              circle at 80% 80%,
              #126047 0,
              transparent 25%
            )
          `,
        }}
      />

      <div
        className="
          tw:relative
          tw:mx-auto
          tw:w-full
          tw:max-w-[1800px]
          tw:px-5
          tw:sm:px-8
          tw:lg:px-10
          tw:xl:px-14
        "
      >
        {/* Heading */}
        <header
          className="
            tw:mb-12
            tw:text-center
            tw:md:mb-14
            tw:lg:mb-16
          "
        >
          <p
            className="
              tw:mb-3
              tw:text-[10px]
              tw:font-medium
              tw:tracking-[0.42em]
              tw:text-[#F9F4EE]
              tw:uppercase
            "
          >
            The Roshni Edit
          </p>

          <h2
            className="
              tw:m-0
              tw:font-serif
              tw:text-[30px]
              tw:font-normal
              tw:tracking-[0.04em]
              tw:text-[#E2CA92]
              tw:sm:text-[36px]
              tw:lg:text-[42px]
            "
          >
            Discover Roshni Creations
          </h2>

          <p
            className="
              tw:mx-auto
              tw:mt-3
              tw:max-w-md
              tw:text-[12px]
              tw:leading-6
              tw:text-[#F8F3E7]/65
            "
          >
            Six expressions. One story of handcrafted beauty.
          </p>
        </header>

        {/* 
          Desktop:
          Six items stay on one line.

          Mobile:
          horizontal editorial strip.
        */}
        <div
          className="
            category-strip
            tw:flex
            tw:items-start
            tw:gap-4
            tw:overflow-x-auto
            tw:pb-5
            tw:scroll-smooth
            tw:sm:gap-6
            tw:lg:grid
            tw:lg:grid-cols-6
            tw:lg:gap-5
            tw:lg:overflow-visible
            tw:xl:gap-7
          "
          role="list"
          aria-label="Jewellery collections"
        >
          {categories.map((category) => (
            <CategoryLetter
              key={category.id}
              {...category}
              isActive={activeCategory === category.id}
              onActivate={() => setActiveCategory(category.id)}
              onDeactivate={() => setActiveCategory(null)}
              onClick={() => navigate(category.url)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;
