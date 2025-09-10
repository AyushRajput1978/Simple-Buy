import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { Table, Dropdown, Card, ButtonGroup, Row } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import type { ApiError, ProductCategoriesResponse, ProductCategoryType } from 'type';

import axios from '../../axios';
import { toast } from '../../utils/helper';
import AddEditProductCategoriesModal from '../AddEditModals/AddEditProductCategoriesModal';
import ConfirmModal from '../layout/AlertModal';
import { TableLoadingShimmer } from '../layout/LoadingShimmers';

interface ProductCategoryResponse {
  status: string;
  data: ProductCategoryType;
}

const ProductCategoriesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState<ProductCategoryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [prodCatId, setProdCatId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchProductCategories = async (): Promise<ProductCategoryType[]> => {
    const res = await axios.get<ProductCategoriesResponse>('/dashboard/product-categories');
    return res.data.data;
  };
  const {
    data: productCategories = [],
    isLoading,
    refetch: refetchProductCategories,
  } = useQuery({
    queryKey: ['product-categories'],
    queryFn: fetchProductCategories,
  });

  const handleEdit = async (id: string) => {
    const res = await axios.get<ProductCategoryResponse>(`/dashboard/product-categories/${id}`);
    setInitialData(res.data.data);
    setShowModal(true);
  };

  const deleteProdCat = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`/dashboard/product-categories/${id}`);
      toast('Product category deleted successfully');
      void refetchProductCategories();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      toast(error.response?.data?.message || 'Something went wrong', false);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDeleteProdCat = async () => {
    if (prodCatId) {
      await deleteProdCat(prodCatId);
      setShowConfirmModal(false);
      setProdCatId(null);
    }
  };

  if (isLoading || loading) {
    return <TableLoadingShimmer />;
  }
  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {productCategories.length > 0 ? (
          <Table hover className="user-table min-height">
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Name</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productCategories.map((cat, index) => (
                <tr key={cat._id}>
                  <td text-label="SNo.">
                    <span className="fw-normal">{index + 1}</span>
                  </td>
                  <td text-label="Name">
                    <span className="fw-normal">{cat.name}</span>
                  </td>

                  <td>
                    <Dropdown as={ButtonGroup} drop="down-centered">
                      <Dropdown.Toggle
                        as="button"
                        className="btn btn-link text-dark m-0 p-0 border-0 shadow-none"
                        id={`dropdown-button-${cat._id}`}
                      >
                        <BsThreeDots size={18} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => {
                            void handleEdit(cat._id);
                          }}
                          className="d-flex align-items-center gap-1"
                        >
                          <FaEdit /> <span>Edit</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-danger d-flex align-items-center gap-1"
                          onClick={() => {
                            setShowConfirmModal(true);
                            setProdCatId(cat._id);
                          }}
                        >
                          <MdDelete />
                          <span>Remove</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Row className="justify-content-center align-item-center text-dark fontweigh-500 p-4">
            {' '}
            No Data Available.....
          </Row>
        )}
      </Card.Body>
      {/* {totalPages > 1 ? (
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-end">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Card.Footer>
      ) : (
        ""
      )} */}
      {/* Add/Edit Modal */}
      <AddEditProductCategoriesModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setInitialData(null);
        }}
        initialData={initialData}
      />
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleConfirmClear={handleConfirmDeleteProdCat}
        heading="Confirm Delete Product Category"
        bodyText="This action is permanent, Are you sure you want to permanently delete this Category?"
        confirmText="Yes, I m sure"
      />
    </Card>
  );
};

export default ProductCategoriesTable;
