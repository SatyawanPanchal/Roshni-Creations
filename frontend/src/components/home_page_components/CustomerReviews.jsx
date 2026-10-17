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
    title: "Great Packaging",
    review:
      "The jewellery is lovely, but I was most impressed by the premium packaging. Makes it perfect for gifting.",
  },
  {
    id: 5,
    name: "Ritika P.",
    title: "Worth Every Penny",
    review:
      "Beautiful finishing and such elegant designs. The jewellery looks even more gorgeous in person.",
  },
  {
    id: 6,
    name: "Meera J.",
    title: "My New Favourite",
    review:
      "I absolutely love my earrings. They are lightweight, comfortable, and perfect for everyday styling.",
  },
  {
    id: 7,
    name: "Kavya R.",
    title: "So Graceful",
    review:
      "The design is so unique and classy. It pairs beautifully with both traditional and modern outfits.",
  },
  {
    id: 8,
    name: "Pooja A.",
    title: "Beautiful Detailing",
    review:
      "You can see the care that goes into the design. The detailing is lovely, and the overall look feels premium.",
  },
  {
    id: 9,
    name: "Shreya M.",
    title: "Perfect Gift",
    review:
      "Bought these as a gift and absolutely loved the presentation. The jewellery looks elegant and thoughtfully made.",
  },
  {
    id: 10,
    name: "Divya S.",
    title: "Elegant Everyday Style",
    review:
      "These pieces add just the right amount of sparkle. I love how easily they complement my everyday outfits.",
  },
  {
    id: 11,
    name: "Aisha K.",
    title: "Lovely Collection",
    review:
      "The collection has such beautiful designs. I found exactly what I wanted for a special family occasion.",
  },
  {
    id: 12,
    name: "Nisha T.",
    title: "A Premium Feel",
    review:
      "Loved the overall look and finishing. The design feels sophisticated without being too heavy or over the top.",
  },
];

const CustomerReviews = () => {
  return (
    <section
      className="
        tw:w-[1240px]
        tw:bg-white
        tw:px-4
        tw:py-4
        tw:sm:px-6
        tw:sm:py-16
        tw:lg:px-10
        tw:lg:py-7
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
            tw:text-[22px]
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

      <div
        className="
    tw:mx-auto
    tw:mt-10
    tw:flex
    tw:gap-4
    tw:overflow-x-auto
    tw:overflow-y-hidden
    tw:pb-4
    tw:px-4
    tw:snap-x
    tw:snap-mandatory
    tw:scroll-smooth
    tw:sm:px-6
    tw:lg:px-10
  "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="
        tw:w-[78vw]
        tw:shrink-0
        tw:snap-start
        tw:sm:w-[300px]
        tw:lg:w-[320px]
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
          tw:mb-3
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
      </div>
      <div
        className="tw:flex
          tw:flex-wrap
          tw:items-center
          tw:justify-center"
        tw:gap-2
      >
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
