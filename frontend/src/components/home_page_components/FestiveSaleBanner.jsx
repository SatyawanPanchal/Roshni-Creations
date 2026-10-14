import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const FestiveSaleBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="tw:w-full tw:bg-[#084C42] tw:px-4 tw:sm:px-6 tw:md:px-16 tw:py-6 tw:md:py-6">
      <div
        className="
          tw:w-full
          tw:min-h-47.5
          tw:flex
          tw:flex-col
          tw:md:flex-row
          tw:items-center
          tw:justify-between
          tw:px-7
          tw:md:px-12.5
          tw:lg:px-13
          tw:py-8
          tw:md:py-6
          tw:gap-0
          tw:md:gap-8
        "
      >
        {/* Left Content */}
        <div className="tw:flex tw:flex-col tw:justify-center">
          {/* Small Label */}
          <span
            className="
              tw:text-[12px]
              tw:tracking-[1.2px]
              tw:uppercase
              tw:text-[#9FD4CB]
              tw:mb-1
              tw:font-[Manrope]
            "
          >
            Limited Time Offer
          </span>

          {/* Heading */}
          <h2
            className="
              tw:m-0
              tw:text-white
              tw:text-[24px]
              tw:md:text-[36px]
              tw:leading-[1.15]
              tw:font-normal
              tw:font-[headings]
            "
          >
            Festive Sparkle Sale
          </h2>

          {/* Description */}
          <p
            className="
              tw:m-0
              tw:mt-4
              tw:hidden
              tw:md:flex
              tw:max-w-140
              tw:text-[18px]
              tw:leading-[1.55]
              tw:text-[#E1EFEC]
              tw:font-light
              tw:font-[Manrope]
            "
          >
            Enjoy up to 30% off on our exquisite Kundan and Polki collections.
            <br />
            Celebrate the season with timeless elegance.
          </p>
        </div>

        {/* CTA */}
        <Button
          label="SHOP OFFERS"
          className="
            tw:!shrink-0
            tw:!border-none
            tw:!rounded-none
            tw:!bg-[#9BE0D6]
            tw:!text-[#16463F]
            tw:!text-[14px]
            tw:!font-[Manrope]
            tw:!tracking-[1px]
            tw:!px-7
            tw:!py-3
            tw:!transition-colors
            tw:!duration-300
            tw:hover:!bg-[#82D3C7]
          "
          onClick={() =>
            navigate(
              `/products/collection/${encodeURIComponent("Festive Edits")}`,
            )
          }
        />
      </div>
    </section>
  );
};

export default FestiveSaleBanner;
