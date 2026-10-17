
import { BreadCrumb } from "primereact/breadcrumb";
import { Check } from "lucide-react";
import "./CheckoutPageHeader.css";

const CheckoutPageHeader = () => {
  const breadcrumbItems = [
    {
      label: "Shopping Bag",
    },
    {
      label: "Secure Checkout",
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
        tw:!border-[#F3ECE4]
        tw:border-b
        tw:!border-[#E3DED8]
        tw:!bg-[#F8F5F1]
      "
    >
      <div
        className="
          tw:mx-auto
          tw:flex
          tw:w-full
          tw:min-h-[88px]
          tw:items-center
          tw:justify-between
          tw:gap-8
          tw:px-7

          tw:sm:px-8
          tw:md:px-10
          tw:lg:px-12
          tw:xl:px-[27px]

          tw:max-md:flex-col
          tw:max-md:items-stretch
          tw:max-md:justify-center
          tw:max-md:gap-3
          tw:max-md:px-4
          tw:max-md:py-4
        "
      >
        {/* =========================
            BREADCRUMB
        ========================== */}
        <div
          className="
            tw:min-w-0
            tw:max-md:w-full
            tw:max-md:overflow-x-auto
            tw:max-md:overflow-y-hidden
            tw:max-md:whitespace-nowrap
          "
        >
          <BreadCrumb
            model={breadcrumbItems}
            home={home}
            className="
              checkout-breadcrumb
              tw:!border-none
              tw:!bg-transparent
              tw:!p-0
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
        </div>

        {/* =========================
            CHECKOUT STEPS
        ========================== */}
        <div
          className="
            tw:relative
            tw:flex
            tw:w-auto
            tw:shrink-0
            tw:items-start
            tw:justify-end

            tw:max-md:w-full
            tw:max-md:justify-between
            tw:max-md:pt-1
          "
        >
          {/* CONNECTING LINE - MOBILE/DESKTOP */}
          <div
            className="
              tw:absolute
              tw:left-[10px]
              tw:right-[10px]
              tw:top-[10px]
              tw:h-px
              tw:bg-[#DED5CC]
              tw:-z-0
            "
          />

          {/* =========================
              STEP 1
          ========================== */}
          <div
            className="
              tw:relative
              tw:z-10
              tw:flex
              tw:shrink-0
              tw:items-center
              tw:bg-[#F8F5F1]
              tw:pr-3

              tw:max-md:w-[30%]
              tw:max-md:justify-start
              tw:max-md:pr-0
            "
          >
            <div
              className="
                tw:flex
                tw:h-[20px]
                tw:w-[20px]
                tw:shrink-0
                tw:items-center
                tw:justify-center
                tw:rounded-full
                tw:border
                tw:border-[#AEBBB5]
                tw:bg-[#EEF0ED]
              "
            >
              <Check
                size={11}
                strokeWidth={1.8}
                className="tw:text-[#153B30]"
              />
            </div>

            <span
              className="
                tw:ml-[7px]
                tw:text-[11px]
                tw:font-medium
                tw:uppercase
                tw:tracking-[0.08em]
                tw:text-[#153B30]
                tw:whitespace-nowrap

                tw:max-sm:ml-[5px]
                tw:max-sm:text-[9px]
              "
            >
              1. BAG
            </span>
          </div>

          {/* =========================
              STEP 2
          ========================== */}
          <div
            className="
              tw:relative
              tw:z-10
              tw:flex
              tw:shrink-0
              tw:items-center
              tw:bg-[#F8F5F1]
              tw:px-3

              tw:max-md:w-[40%]
              tw:max-md:justify-center
              tw:max-md:px-0
            "
          >
            <div
              className="
                tw:flex
                tw:h-5.25
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
                2
              </span>
            </div>

            <span
              className="
                tw:ml-[7px]
                tw:text-[11px]
                tw:font-medium
                tw:uppercase
                tw:tracking-[0.07em]
                tw:text-[#153B30]
                tw:whitespace-nowrap

                tw:max-sm:ml-[5px]
                tw:max-sm:text-[8px]
              "
            >
              SHIPPING & DETAILS
            </span>
          </div>

          {/* =========================
              STEP 3
          ========================== */}
          <div
            className="
              tw:relative
              tw:z-10
              tw:flex
              tw:shrink-0
              tw:items-center
              tw:bg-[#F8F5F1]
              tw:pl-3

              tw:max-md:w-[30%]
              tw:max-md:justify-end
              tw:max-md:pl-0
            "
          >
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
                tw:text-[11px]
                tw:font-normal
                tw:uppercase
                tw:tracking-[0.08em]
                tw:text-[#77716C]
                tw:whitespace-nowrap

                tw:max-sm:ml-[5px]
                tw:max-sm:text-[9px]
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

export default CheckoutPageHeader;