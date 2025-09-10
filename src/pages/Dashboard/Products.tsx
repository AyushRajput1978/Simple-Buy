import { useState } from 'react';

import AddEditProductModal from '../../components/AddEditModals/AddEditProductModal';
import AddButton from '../../components/layout/AddButton';
import ProductsTable from '../../components/Tables/ProductsTable';

const DashboardProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const handleAddProduct = () => {
    setShowModal(true);
  };
  return (
    <div className="container overflow-hidden p-0">
      <h1>PRODUCTS</h1>
      <div className="d-flex justify-content-end mb-4">
        <AddButton
          label="Add Product"
          icon="fa fa-box"
          onClick={handleAddProduct}
          className="px-3"
        />
      </div>
      <ProductsTable />
      <AddEditProductModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};
export default DashboardProducts;
