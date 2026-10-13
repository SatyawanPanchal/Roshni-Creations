/* eslint-disable no-unused-vars */
import { BreadCrumb } from "primereact/breadcrumb";
import "./ShoppingBagHeader.css";

const ShoppingBagHeader = () => {
  const breadcrumbItems = [
    {
      label: "Shopping Bag",
    },
  ];

  const home = {
    label: "Home",
  };

  return (
    <header
      className="
        tw:w-full
        tw:border-t
        tw:border-[#F3ECE4]
        tw:border-b
        tw:border-[#E3DED8]
        tw:bg-[#F8F5F1]
      "
    >
      <div
        className="
          tw:mx-auto
          tw:flex
          tw:min-h-[88px]
          tw:w-full
          tw:items-center
          tw:justify-between
          tw:gap-6
          tw:px-4

          tw:sm:px-6
          tw:md:px-10
          tw:lg:px-12
          tw:xl:px-[27px]

          tw:max-[767px]:flex-col
          tw:max-[767px]:items-stretch
          tw:max-[767px]:justify-center
          tw:max-[767px]:gap-5
          tw:max-[767px]:py-5
        "
      >
        {/* =========================
            BREADCRUMB
        ========================== */}
        <BreadCrumb
          model={breadcrumbItems}
          home={home}
          className="
            shopping-bag-breadcrumb
            tw:!border-none
            tw:!bg-transparent
            tw:!p-0
            tw:max-[767px]:w-full
            tw:!text-[12px]
            tw:sm:!text-[14px]
          "
          pt={{
            root: {
              className: "tw:!border-none tw:!bg-transparent tw:!p-0",
            },
            list: {
              className: "tw:!p-0",
            },
          }}
        />

        {/* =========================
            CHECKOUT STEPS
        ========================== */}
        <div
          className="
            tw:flex
            tw:items-center
            tw:justify-end
            tw:shrink-0
            tw:max-[767px]:w-full
            tw:max-[767px]:justify-between
            tw:max-[480px]:justify-center
          "
        >
          {/* STEP 1 */}
          <div className="tw:flex tw:items-center tw:shrink-0">
            <div
              className="
                tw:flex
                tw:h-[21px]
                tw:w-[21px]
                tw:shrink-0
                tw:items-center
                tw:justify-center
                tw:rounded-full
                tw:bg-[#153B30]
                tw:text-[#F8F5F1]
              "
            >
              <span
                className="
                  tw:text-[10px]
                  tw:font-medium
                  tw:leading-none
                "
              >
                1
              </span>
            </div>

            <span
              className="
                tw:ml-[7px]
                tw:whitespace-nowrap
                tw:text-[11px]
                tw:font-medium
                tw:uppercase
                tw:tracking-[0.08em]
                tw:text-[#153B30]

                tw:max-[480px]:text-[9px]
                tw:max-[380px]:ml-[5px]
                tw:max-[380px]:text-[8px]
              "
            >
              1. BAG
            </span>
          </div>

          {/* CONNECTOR */}
          <span
            className="
              tw:mx-3
              tw:block
              tw:h-px
              tw:w-[28px]
              tw:shrink
              tw:bg-[#DED5CC]

              tw:sm:w-[34px]
              tw:md:w-[42px]

              tw:max-[480px]:mx-2
              tw:max-[380px]:w-[18px]
              tw:max-[380px]:mx-1.5
            "
          />

          {/* STEP 2 */}
          <div className="tw:flex tw:items-center tw:shrink-0">
            <div
              className="
                tw:flex
                tw:h-[21px]
                tw:w-[21px]
                tw:shrink-0
                tw:items-center
                tw:justify-center
                tw:rounded-full
                tw:border
                tw:border-[#D8D0C7]
                tw:bg-[#FBF9F6]
              "
            >
              <span
                className="
                  tw:text-[10px]
                  tw:font-normal
                  tw:text-[#77716C]
                "
              >
                2
              </span>
            </div>

            <span
              className="
                tw:ml-[7px]
                tw:whitespace-nowrap
                tw:text-[11px]
                tw:font-normal
                tw:uppercase
                tw:tracking-[0.07em]
                tw:text-[#77716C]

                tw:max-[480px]:text-[9px]
                tw:max-[380px]:ml-[5px]
                tw:max-[380px]:text-[8px]
              "
            >
              SHIPPING & DETAILS
            </span>
          </div>

          {/* CONNECTOR */}
          <span
            className="
              tw:mx-3
              tw:block
              tw:h-px
              tw:w-[28px]
              tw:shrink
              tw:bg-[#DED5CC]

              tw:sm:w-[34px]
              tw:md:w-[42px]

              tw:max-[480px]:mx-2
              tw:max-[380px]:w-[18px]
              tw:max-[380px]:mx-1.5
            "
          />

          {/* STEP 3 */}
          <div className="tw:flex tw:items-center tw:shrink-0">
            <div
              className="
                tw:flex
                tw:h-[21px]
                tw:w-[21px]
                tw:shrink-0
                tw:items-center
                tw:justify-center
                tw:rounded-full
                tw:border
                tw:border-[#D8D0C7]
                tw:bg-[#FBF9F6]
              "
            >
              <span
                className="
                  tw:text-[10px]
                  tw:font-normal
                  tw:text-[#77716C]
                "
              >
                3
              </span>
            </div>

            <span
              className="
                tw:ml-[7px]
                tw:whitespace-nowrap
                tw:text-[11px]
                tw:font-normal
                tw:uppercase
                tw:tracking-[0.08em]
                tw:text-[#77716C]

                tw:max-[480px]:text-[9px]
                tw:max-[380px]:ml-[5px]
                tw:max-[380px]:text-[8px]
              "
            >
              PAYMENT
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShoppingBagHeader;