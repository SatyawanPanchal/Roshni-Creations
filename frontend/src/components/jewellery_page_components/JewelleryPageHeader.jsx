import { BreadCrumb } from "primereact/breadcrumb";
import { useParams } from "react-router-dom";

const JewelleryPageHeader = () => {
  const { category, subcategory, collection } = useParams();

  // Decode URL values
  const activeCategory = category ? decodeURIComponent(category) : null;

  const activeSubcategory = subcategory
    ? decodeURIComponent(subcategory)
    : null;

  const activeCollection = collection ? decodeURIComponent(collection) : null;

  // Decide what should be displayed
  const pageTitle =
    activeSubcategory || activeCategory || activeCollection || "All Jewellery";

  const breadcrumbItems = [
    {
      label: pageTitle.toUpperCase(),
      template: () => (
        <span
          className="
            tw:text-[12px]
            tw:sm:text-[13px]
            tw:tracking-[1.1px]
            tw:text-[#123d35]
            tw:font-semibold
          "
        >
          {pageTitle.toUpperCase()}
        </span>
      ),
    },
  ];

  const home = {
    icon: "pi pi-home",
    url: "/",
  };

  return (
    <section
      className="
        tw:w-full
        tw:border-t
        tw:border-[#e8e5df]
        tw:border-b
        tw:bg-[#fdfcf9]
      "
    >
      <div
        className="
          tw:w-full
          tw:flex
          tw:flex-col
          tw:items-center
          tw:justify-center
          tw:text-center

          tw:px-5
          tw:py-8

          tw:sm:px-6
          tw:sm:py-9

          tw:md:px-8
          tw:md:py-10

          tw:lg:px-10
          tw:lg:py-11
        "
      >
        {/* Breadcrumb */}
        <BreadCrumb
          model={breadcrumbItems}
          home={home}
          pt={{
            root: {
              className: `
                tw:!border-none
                tw:!bg-transparent
                tw:!p-0
                tw:mb-4

                tw:sm:mb-5
                tw:md:mb-5
              `,
            },

            list: {
              className: `
                tw:flex
                tw:items-center
                tw:justify-center
                tw:gap-2
                tw:m-0
                tw:p-0
              `,
            },

            item: {
              className: `
                tw:!p-0
              `,
            },

            separator: {
              className: `
                tw:!mx-1
                tw:text-[#b9b5ae]
                tw:text-[13px]
                tw:sm:text-[14px]
              `,
            },

            action: {
              className: `
                tw:!p-0
                tw:!bg-transparent
                tw:!shadow-none
                tw:!no-underline
                tw:!rounded-none
              `,
            },
          }}
        />

        {/* Page Title */}
        <h1
          className="
    tw:m-0
    tw:text-[#123d35]
    tw:font-normal
    tw:leading-[1.05]
    tw:tracking-[-1.5px]
    tw:break-words
    tw:px-2

    tw:text-[40px]

    tw:sm:text-[54px]
    tw:md:text-[62px]
    tw:lg:text-[68px]
    tw:xl:text-[72px]
    tw:capitalize
  "
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {pageTitle}
        </h1>

        {/* Description */}
        <p
          className="
            tw:m-0
            tw:mt-4
            tw:max-w-190
            tw:text-[#8f8980]
            tw:font-normal
            tw:italic
            tw:leading-relaxed

            tw:text-[15px]

            tw:sm:text-[16px]
            tw:md:text-[17px]

            tw:px-2
          "
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {activeCollection
            ? `Explore our ${activeCollection} collection, thoughtfully created to complement every occasion.`
            : activeSubcategory
              ? `Discover our beautiful ${activeSubcategory.toLowerCase()}, handcrafted to add a special touch to every look.`
              : activeCategory
                ? `Explore our ${activeCategory.toLowerCase()} jewellery collection, designed for every occasion.`
                : "Discover jewellery designed to celebrate every facet of your life and treasured memories."}
        </p>
      </div>
    </section>
  );
};

export default JewelleryPageHeader;
