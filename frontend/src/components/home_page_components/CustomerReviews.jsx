import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Heart } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Priya S.",
    title: "Unparalleled Craftsmanship",
    review:
      "The Kundan Jhumki I purchased for my daughter's wedding was absolutely breathtaking. It truly felt like passing down a piece of heritage.",
  },
  {
    id: 2,
    name: "Anjali M.",
    title: "Beautiful & Elegant",
    review:
      "Loved the minimal earrings. They are perfect for daily wear and add a touch of elegance to any outfit.",
  },
  {
    id: 3,
    name: "Neha K.",
    title: "Perfect Festive Wear",
    review:
      "Wore the mangalsutra set for Diwali. Got so many compliments. The quality is top-notch.",
  },
  {
    id: 4,
    name: "Sneha R.",
    title: "Great packaging",
    review:
      "The jewellery is lovely, but I was most impressed by the premium packaging. Makes it perfect for gifting.",
  },
];

const CustomerReviews = () => {
  return (
    <section
      className="
        tw:w-full
        tw:bg-white
        tw:px-4
        tw:py-4
        tw:sm:px-6
        tw:sm:py-16
        tw:lg:px-10
        tw:lg:py-20
      "
    >
      {/* ================= HEADER ================= */}
      <div className="tw:mx-auto tw:max-w-3xl tw:text-center">
        {/* Heart */}
        <div className="tw:mb-2 tw:flex tw:justify-center">
          <Heart
            size={20}
            fill="#ef4444"
            strokeWidth={0}
            className="tw:text-red-500"
          />
        </div>

        {/* Heading */}
        <h2
          className="
            tw:font-serif
            tw:text-[30px]
            tw:font-normal
            tw:leading-tight
            tw:text-[#292929]
            tw:sm:text-[34px]
            tw:md:text-[38px]
          "
        >
          Hear From Our Roshni Queens
        </h2>

        {/* Subtitle */}
        <p
          className="
            tw:mt-2
            tw:text-[10px]
            tw:font-medium
            tw:tracking-[1.8px]
            tw:text-[#9ca3af]
            tw:sm:text-[11px]
          "
        >
          VERIFIED REVIEWS
        </p>
      </div>

      {/* ================= REVIEW CARDS =================
          Mobile: horizontal snap-scroll. sm+: original grid, unchanged. */}
      <div
        className="
          tw:mx-auto tw:mt-10 tw:max-w-[1060px]
          tw:flex tw:gap-4 tw:overflow-x-auto tw:pb-4 tw:-mx-4 tw:px-4
          tw:snap-x tw:snap-mandatory tw:scroll-smooth
          tw:sm:mx-auto tw:sm:px-0 tw:sm:grid tw:sm:grid-cols-2 tw:sm:overflow-visible
          tw:sm:gap-5 tw:lg:grid-cols-4 tw:lg:gap-5
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="
              tw:w-[78vw] tw:shrink-0 tw:snap-start tw:sm:w-auto tw:sm:shrink
              tw:flex
              tw:min-h-51.25
              tw:flex-col
              tw:items-center
              tw:!rounded-[8px]
              tw:border
              tw:border-[#eee9e1]
              tw:bg-[#faf8f4]
              tw:px-5
              tw:py-6
              tw:text-center
              tw:transition-all
              tw:duration-300
              tw:hover:border-[#e5ddd1]
              tw:hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]
            "
          >
            {/* Stars */}
            <Rating
              value={5}
              readOnly
              cancel={false}
              className="
                tw:mb-3
              "
              pt={{
                onIcon: {
                  className: "tw:!text-[#15803d]",
                },
              }}
            />

            {/* Name + Verified */}
            <div className="tw:flex tw:items-center tw:justify-center tw:gap-2">
              <span
                className="
                  tw:text-[13px]
                  tw:font-semibold
                  tw:text-[#303030]
                "
              >
                {review.name}
              </span>

              <Tag
                value="VERIFIED"
                className="
                  tw:rounded-[3px]
                  tw:!bg-[#dcfce7]
                  tw:px-1.5
                  tw:py-0.5
                  tw:text-[8px]
                  tw:font-semibold
                  tw:!text-[#15803d]
                "
              />
            </div>

            {/* Review Title */}
            <h3
              className="
                tw:mt-2
                tw:font-serif
                tw:text-[16px]
                tw:italic
                tw:font-normal
                tw:leading-tight
                tw:text-[#353535]
              "
            >
              "{review.title}"
            </h3>

            {/* Review Text */}
            <p
              className="
                tw:mt-3
                tw:max-w-[230px]
                tw:text-[11px]
                tw:font-normal
                tw:leading-[1.45]
                tw:text-[#59616b]
              "
            >
              {review.review}
            </p>
          </div>
        ))}
      </div>

      {/* ================= OVERALL RATING ================= */}
      <div
        className="
          tw:mt-8
          tw:flex
          tw:flex-wrap
          tw:items-center
          tw:justify-center
          tw:gap-2
          tw:sm:mt-9
        "
      >
        {/* Number */}
        <span
          className="
            tw:text-[17px]
            tw:font-semibold
            tw:text-[#303030]
          "
        >
          4.8
        </span>

        {/* Stars */}
        <Rating
          value={4}
          readOnly
          cancel={false}
          className="tw:ml-1"
          pt={{
            onIcon: {
              className: "tw:!text-[#15803d]",
            },
          }}
        />

        {/* Based on */}
        <span
          className="
            tw:text-[11px]
            tw:text-[#59616b]
            tw:sm:text-[12px]
          "
        >
          Based on
        </span>

        {/* Reviews link */}
        <button
          type="button"
          className="
            tw:cursor-pointer
            tw:border-none
            tw:bg-transparent
            tw:p-0
            tw:text-[11px]
            tw:text-[#59616b]
            tw:underline
            tw:underline-offset-2
            tw:sm:text-[12px]
          "
        >
          1200+ reviews
        </button>
      </div>
    </section>
  );
};

export default CustomerReviews;
