import CheckoutPageHeader from "../components/checkout_page_components/CheckoutPageHeader";
import CheckoutSection from "../components/checkout_page_components/CheckoutSection";
import Recommended from "../components/description_page_components/Recommended";

const CheckoutPage = () => {
  return (
    <>
      <CheckoutPageHeader />
      <CheckoutSection />
      <Recommended/>
    </>
  );
};

export default CheckoutPage;
