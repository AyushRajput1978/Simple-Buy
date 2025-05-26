import { useState } from "react";
import AddButton from "../../components/layout/AddButton";
import ProductCategoriesTable from "../../components/Tables/ProductCategoriesTable";
import AddEditProductCategoriesModal from "../../components/AddEditModals/AddEditProductCategoriesModal";

const ProductCategories = () => {
  const [openModal, setOpenModal] = useState(false);
  const handleAddProductCategory = () => {
    setOpenModal(true);
  };
  return (
    <div className="container">
      <h1>PRODUCT CATEGORIES</h1>
      <div className="d-flex justify-content-end mb-4">
        <AddButton
          label="Add Product Category"
          icon="fa fa-box"
          onClick={handleAddProductCategory}
          className="px-3"
        />
      </div>
      <ProductCategoriesTable />
      <AddEditProductCategoriesModal
        show={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};
export default ProductCategories;
