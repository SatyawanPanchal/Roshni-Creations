/* eslint-disable no-unused-vars */
/ * eslint-disable no-unused-vars * /;
import { Card } from "primereact/card";
import { Handbag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { id, image, name, price } = product;
  const { addToCart } = useCart();
  const toast = useRef(null);
  const handleAddToCart = () => {
    const result = addToCart(product);

    if (result?.success) {
      toast.current.show({
        severity: "success",
        summary: "Added to bag",
        detail: product.name,
        life: 2500,
      });
    }
  };
  return (
    <Card
      pt={{
        root: {
          className:
            "tw:!border-none tw:!shadow-none tw:!bg-transparent tw:p-0 tw:rounded-none",
        },
        body: {
          className: "tw:p-0",
        },
        content: {
          className: "tw:p-0",
        },
      }}
    >
      <Toast ref={toast} />
      {/* Product Image */}
      <div
        className="
          tw:group
          tw:relative
          tw:w-full
          tw:aspect-5/6
          tw:overflow-hidden
          tw:rounded-[16px]
          tw:bg-[#f1eeee]
        "
      >
        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="
            tw:block
            tw:w-full
            tw:h-full
            tw:object-cover

            tw:transition-transform
            tw:duration-700
            tw:ease-[cubic-bezier(0.22,1,0.36,1)]

            tw:group-hover:scale-[1.04]
          "
          onClick={() => navigate(`/description/${id}`)}
        />

        {/* Soft Overlay */}
        <div
          className="
            tw:absolute
            tw:inset-0
            tw:pointer-events-none

            tw:bg-black/0
            tw:group-hover:bg-black/[0.03]

            tw:transition-colors
            tw:duration-700
            tw:ease-out
          "
        />

        {/* Cart Button */}
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={handleAddToCart}
          className="
            tw:absolute
            tw:top-5
            tw:right-5
            tw:z-10

            tw:flex
            tw:h-12
            tw:w-12
            tw:items-center
            tw:justify-center

            tw:rounded-[16px]
            tw:border-none
            tw:bg-white
            tw:text-[#16463F]

            tw:cursor-pointer
            tw:shadow-sm

            tw:opacity-0
            tw:translate-y-2

            tw:group-hover:opacity-100
            tw:group-hover:translate-y-0
            tw:hover:bg-[#006f68]
            tw:hover:text-white

            tw:transition-all
            tw:duration-500
            tw:ease-[cubic-bezier(0.22,1,0.36,1)]
          "
        >
          <Handbag size={19} strokeWidth={1.5} />
        </button>

        {/* Quick View */}
        <button
          type="button"
          className="
            tw:absolute
            tw:left-5
            tw:right-5
            tw:bottom-5
            tw:z-10

            tw:h-14

            tw:flex
            tw:items-center
            tw:justify-center

            tw:rounded-[8px]
            tw:border-none
            tw:bg-white
            tw:text-[#006f68]

            tw:text-[16px]
            tw:font-normal
            tw:tracking-wide

            tw:cursor-pointer

            tw:opacity-0
            tw:translate-y-4

            tw:group-hover:opacity-100
            tw:group-hover:translate-y-0
            tw:hover:bg-[#006f68]
            tw:hover:text-white

            tw:transition-all
            tw:duration-600
            tw:ease-[cubic-bezier(0.22,1,0.36,1)]
          "
          onClick={() => navigate(`/description/${id}`)}
        >
          QUICK VIEW
        </button>
      </div>

      {/* Product Information */}
      <div
        className="
          tw:w-full
          tw:text-center
          tw:pt-3
          tw:border-none
        "
      >
        <h3
          className="
            tw:m-0
            tw:overflow-hidden
            tw:text-ellipsis
            tw:whitespace-nowrap
            tw:text-[15px]

            tw:font-[Manrope]
            tw:tracking-wide
            tw:leading-[1.4]
            tw:text-[#191C1B]
          "
          title={name}
        >
          {name}
        </h3>

        <p
          className="
            tw:m-0
            tw:mt-1
            tw:text-[20px]
            tw:font-[headings]
            tw:tracking-wide
            tw:leading-[1.4]
            tw:text-[#006f68]
          "
        >
          ₹ {price}
        </p>
      </div>
    </Card>
  );
};

export default ProductCard;
