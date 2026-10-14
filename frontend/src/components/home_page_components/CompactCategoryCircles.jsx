import { useNavigate } from "react-router-dom";

// Same category images/data as ShopByCollection — kept in sync intentionally.
import earringsImage from "../../images/categoryImages/earrings.png";
import necklacesImage from "../../images/categoryImages/necklaces.webp";
import braceletsImage from "../../images/categoryImages/jewellerySets.webp";
import resinImage from "../../images/categoryImages/resinJewellery.webp";
import fabricJewelleryImage from "../../images/categoryImages/fabricJewellery.webp";
import watchesImage from "../../images/categoryImages/kashmereWatch.webp";

const categories = [
  {
    id: "earrings",
    title: "Earrings",
    image: earringsImage,
    url: "/products/subcategory/Earrings",
  },
  {
    id: "necklaces",
    title: "Necklaces",
    image: necklacesImage,
    url: "/products/subcategory/Necklaces",
  },
  {
    id: "jewellery sets",
    title: "Jewellery Sets",
    image: braceletsImage,
    url: "/products/category/jewellery%20sets",
  },
  {
    id: "resin jewellery",
    title: "Resin",
    image: resinImage,
    url: "/products/category/resin%20jewellery",
  },
  {
    id: "fabric",
    title: "Fabric",
    image: fabricJewelleryImage,
    url: "/products/category/fabric%20jewellery",
  },
  {
    id: "watches",
    title: "Watches",
    image: watchesImage,
    url: "/products/category/kashmere%20watch",
  },
];

// Mobile-only compact version of ShopByCollection. Hide the full
// letter-morph ShopByCollection on mobile (tw:hidden tw:lg:block) and
// mount this instead — it already hides itself above lg with tw:lg:hidden.
const CompactCategoryCircles = () => {
  const navigate = useNavigate();

  return (
    <section className="tw:w-full tw:lg:hidden tw:bg-[#08415A] tw:py-2 tw:px-4">
      <p className="tw:text-center tw:text-[10px] tw:font-medium tw:tracking-[0.3em] tw:text-[#F9F4EE] tw:uppercase tw:mb-4">
        Shop by category
      </p>
      <div
        className="tw:flex tw:gap-5 tw:overflow-x-auto tw:pb-2 tw:-mx-4 tw:px-4 tw:snap-x tw:snap-mandatory tw:scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => navigate(cat.url)}
            className="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:shrink-0 tw:snap-start tw:w-16 tw:bg-transparent tw:border-none tw:cursor-pointer"
          >
            <span className="tw:block tw:h-16 tw:w-16 tw:overflow-hidden tw:rounded-full tw:border tw:border-[#E2CA92]/60">
              <img
                src={cat.image}
                alt={cat.title}
                className="tw:h-full tw:w-full tw:object-cover"
              />
            </span>
            <span className="tw:text-[10px] tw:tracking-wide tw:text-[#F8F3E7] tw:text-center tw:leading-tight">
              {cat.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CompactCategoryCircles;
