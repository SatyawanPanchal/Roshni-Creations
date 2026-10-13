import { useCallback, useState } from "react";
import CategoryLetter from "./CategoryLetter";
import { ROSHNI_CATEGORIES } from "./categories";
import "./roshni-categories.css";

/**
 * RoshniCategories
 * -----------------------------------------------------------------------
 * "Shop by Collection" section built from the six letters of ROSHNI, each
 * one an image-masked category that morphs into a circle on hover/focus.
 *
 * Palette is sourced only from the ROSHNI logo (warm ivory, antique gold,
 * peacock blue/green, deep teal) — never from the pink/beige reference
 * layout image, which informed composition and interaction only.
 *
 * Active-letter state lives here, one level above the six <CategoryLetter>
 * instances, purely so the five *un*-hovered letters can quietly recede
 * (req: scale down / reduce opacity, never fully hide) while the hovered
 * one comes forward — that cross-item behaviour can't be expressed with
 * CSS :hover alone.
 * -----------------------------------------------------------------------
 */
export default function RoshniCategories() {
  const [activeId, setActiveId] = useState(null);

  const handleActivate = useCallback((id) => setActiveId(id), []);
  const handleDeactivate = useCallback(
    (id) => setActiveId((current) => (current === id ? null : current)),
    []
  );

  return (
    <section
      className="tw:relative tw:w-full tw:bg-[#FAF6EF] tw:py-20 tw:sm:py-24"
      aria-labelledby="roshni-categories-heading"
    >
      {/* Heading stays deliberately quiet — the six letters are the focal point */}
      <div className="tw:mx-auto tw:max-w-3xl tw:px-6 tw:text-center tw:mb-14 tw:sm:mb-16">
        <h2
          id="roshni-categories-heading"
          className="tw:font-serif tw:text-2xl tw:sm:text-3xl tw:text-[#1B3A3A] tw:tracking-[0.01em]"
        >
          Discover Roshni
        </h2>
        <p className="tw:mt-2 tw:text-sm tw:text-[#5C6B63]">
          Jewellery with a story
        </p>
      </div>

      {/* Mobile (default): horizontally scrollable editorial strip.
          md and up: everything unfolds into one fixed horizontal row. */}
      <div
        className={[
          "tw:flex tw:gap-4 tw:overflow-x-auto tw:snap-x tw:snap-mandatory",
          "tw:px-6 tw:pb-2 tw:roshni-no-scrollbar",
          "tw:md:overflow-visible tw:md:snap-none tw:md:px-8 tw:lg:px-16",
          "tw:md:flex-nowrap tw:md:justify-between tw:md:gap-3 tw:lg:gap-6",
          "tw:mx-auto tw:max-w-[1400px]",
        ].join(" ")}
      >
        {ROSHNI_CATEGORIES.map((category) => (
          <CategoryLetter
            key={category.id}
            letter={category.letter}
            title={category.title}
            href={category.href}
            image={category.image}
            alt={category.alt}
            isActive={activeId === category.id}
            isDimmed={activeId !== null && activeId !== category.id}
            onActivate={() => handleActivate(category.id)}
            onDeactivate={() => handleDeactivate(category.id)}
          />
        ))}
      </div>
    </section>
  );
}
