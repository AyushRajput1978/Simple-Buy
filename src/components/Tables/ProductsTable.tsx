import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { Table, Dropdown, Card, ButtonGroup, Image, Row } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import type { ApiError, DetailedProduct, DetailedProductResponse, ProductResponse, ProductType } from "type";

import axios from "../../axios";
import { toast } from "../../utils/helper";
import AddEditProductModal from "../AddEditModals/AddEditProductModal";
import ConfirmModal from "../layout/AlertModal";
import { TableLoadingShimmer } from "../layout/LoadingShimmers";

const ProductsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState<DetailedProduct|null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productId, setProductId] = useState("");

  const fetchProducts = async ():Promise<ProductType[]> => {
    const res = await axios.get<ProductResponse>("/dashboard/products");
    return res.data.data;
  };
  const {
    data:products=[],
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleEdit = async (id:string) => {
    const res = await axios.get<DetailedProductResponse>(`/dashboard/products/${id}`);
    setInitialData(res.data.data);
    setShowModal(true);
  };

  const deleteProduct = async (id:string) => {
    setLoading(true);
    try {
      await axios.delete(`/dashboard/products/${id}`);
      toast("Product deleted successfully");
      void refetchProducts();
    } catch (err) {
      const error=err as AxiosError<ApiError>
      toast(error.response?.data.message || "Something went wrong", false);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return <TableLoadingShimmer />;
  }
  const handleConfirmDeleteProduct = () => {
   void deleteProduct(productId);
    setShowConfirmModal(false);
    setProductId("");
  };
  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {products.length > 0 ? (
          <div className="table-responsive">
            <Table
              hover
              className="user-table min-height"
              style={{ minWidth: "800px" }}
            >
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, index) => (
                  <tr key={prod.id}>
                    <td text-label="SNo.">
                      <span className="fw-normal">{index + 1}</span>
                    </td>
                    <td text-label="Image">
                      <Image
                        src={prod.image}
                        alt={`${prod.name} image`}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td text-label="Name">
                      <span className="fw-normal">{prod.name}</span>
                    </td>
                    <td text-label="category">
                      <span className="fw-normal">{prod.category.name}</span>
                    </td>
                    <td text-label="Price">
                      <span className="fw-normal">{prod.price}</span>
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup} drop="down-centered">
                        <Dropdown.Toggle
                          as="button"
                          className="btn btn-link text-dark m-0 p-0 border-0 shadow-none"
                          id={`dropdown-button-${prod.id}`}
                        >
                          <BsThreeDots size={18} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                             void handleEdit(prod.id);
                            }}
                            className="d-flex align-items-center gap-1"
                          >
                            <FaEdit /> <span>Edit</span>
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger d-flex align-items-center gap-1"
                            onClick={() => {
                              setShowConfirmModal(true);
                              setProductId(prod.id);
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
          </div>
        ) : (
          <Row className="justify-content-center align-item-center text-dark fontweigh-500 p-4">
            No Data Available.....
          </Row>
        )}
      </Card.Body>

      <AddEditProductModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setInitialData(null)
        }}
        initialData={initialData}
      />
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleConfirmClear={handleConfirmDeleteProduct}
        heading="Confirm Delete Product"
        bodyText="This action is permanent, Are you sure you want to permanently delete this product?"
        confirmText="Yes, I m sure"
      />
    </Card>
  );
};

export default ProductsTable;
