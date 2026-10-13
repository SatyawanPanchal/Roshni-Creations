import { useNavigate } from "react-router-dom";

const TopMarquee = () => {
  const navigate = useNavigate()
  return (
    <div className="tw:bg-[#292929] tw:text-white tw:h-8 tw:flex tw:items-center tw:justify-center tw:px-4 tw:gap-2">
      <p className="tw:text-[0.45rem] tw:sm:text-[0.7rem] tw:tracking-[1px] tw:font-normal tw:mr-2">
        ENJOY 30% OFF OUR HERITAGE COLLECTION SALE{" "}
        <button
          onClick={()=>navigate("/products")}
          className="tw:text-[#b99a63] tw:underline tw:underline-offset-2 tw:hover:text-[#d2b77e] tw:transition-colors tw:cursor-pointer"
        >
          SHOP NOW
        </button>
      </p>
    </div>
  );
};

export default TopMarquee;