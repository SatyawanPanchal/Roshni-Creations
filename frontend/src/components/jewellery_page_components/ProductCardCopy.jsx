import { Handbag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const BADGE_STYLES = {
  BESTSELLER: "tw:bg-amber-800 tw:text-amber-50",
  NEW: "tw:bg-rose-800 tw:text-rose-50",
  HERITAGE: "tw:bg-emerald-900 tw:text-emerald-50",
};

export default function ProductCardCopy({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const toast = useRef(null);

  const id = product?._id;

  const handleAddToCart = async (e) => {
    // Prevent parent/card click if you later add one
    e.stopPropagation();

    try {
      const result = await addToCart(product);

      if (result?.success) {
        toast.current?.show({
          severity: "success",
          summary: "Added to bag",
          detail: `${product.name} added to your bag`,
          life: 2500,
        });
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Unable to add",
          detail: result?.message || "Could not add this product to your bag.",
          life: 2500,
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      toast.current?.show({
        severity: "error",
        summary: "Something went wrong",
        detail: "Unable to add this product to your bag.",
        life: 3000,
      });
    }
  };

  return (
    <div className="tw:group tw:flex tw:flex-col tw:cursor-pointer">
      <Toast ref={toast} />

      <div className="tw:relative tw:aspect-[4/5] tw:overflow-hidden tw:rounded-md tw:bg-stone-100">
        <img
          src={product?.image}
          alt={product?.name || "Product"}
          loading="lazy"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${id}`);
          }}
          className="tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-300 tw:group-hover:scale-[1.03]"
        />

        {product?.badge && (
          <span
            className={`tw:absolute tw:left-0 tw:top-3 tw:rounded-r-full tw:px-3 tw:py-1 tw:text-[10px] tw:font-semibold tw:tracking-wide ${
              BADGE_STYLES[product.badge] ?? "tw:bg-stone-800 tw:text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

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
          aria-label={`Add ${product?.name || "product"} to cart`}
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
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${id}`);
          }}
        >
          QUICK VIEW
        </button>
      </div>

      <h3 className="tw:mt-3 tw:line-clamp-2 tw:text-[14px] tw:leading-snug tw:text-stone-800">
        {product?.name}
      </h3>

      <p className="tw:mt-1 tw:text-[14px] tw:font-semibold tw:text-stone-900">
        ₹{Number(product?.price || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
