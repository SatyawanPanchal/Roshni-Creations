import { useParams } from "react-router-dom";

import JewelleryPageHeader from "../components/jewellery_page_components/JewelleryPageHeader";
import ProductListing from "../components/jewellery_page_components/ProductListing";

const ProductsPage = () => {
  const { category, subcategory, collection } = useParams();

  return (
    <>
      <JewelleryPageHeader
        category={category}
        subcategory={subcategory}
        collection={collection}
      />

      <ProductListing
        category={category}
        subcategory={subcategory}
        collection={collection}
      />
    </>
  );
};

export default ProductsPage;