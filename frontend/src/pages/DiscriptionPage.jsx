import ProductDetail from "../components/description_page_components/ProductDetail";
import Recommended from "../components/description_page_components/Recommended";
import CustomerReviews from "../components/home_page_components/CustomerReviews";

const DiscriptionPage = () => {
  return (
    <>
      <div className="tw:flex tw:flex-col tw:items-center">
        <ProductDetail />
        <Recommended />
        <CustomerReviews />
      </div>
    </>
  );
};

export default DiscriptionPage;
