import JewelryCartSection from "../components/cart_page_components/JewelryCartSection";
import ShoppingBagHeader from "../components/cart_page_components/ShoppingBagHeader";
import Recommended from "../components/description_page_components/Recommended";

const CartPage = () => {
  return (
    <>
      <ShoppingBagHeader />
      <JewelryCartSection />
      <Recommended />
    </>
  );
};

export default CartPage;
