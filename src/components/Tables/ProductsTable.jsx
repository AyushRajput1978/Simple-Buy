import axios from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { Table, Dropdown, Card, ButtonGroup, Image } from "react-bootstrap";
import { useReducer, useState } from "react";
import AddEditProductModal from "../AddEditModals/AddEditProductModal";
import { TableLoadingShimmer } from "../layout/LoadingShimmers";
import { toast } from "../../utils/helper";

const ProductsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Functions
  const fetchProducts = async () => {
    const res = await axios.get("/dashboard/products");
    return res.data.data;
  };
  const handleEdit = async (id) => {
    const res = await axios.get(`/dashboard/products/${id}`);
    setInitialData(res.data.data);
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`/dashboard/products/${id}`);
      //  Show success toast
      toast("Product deleted successfully");
      refetchProducts();
    } catch (err) {
      toast(err.response.data.message || "Something went wrong", false);
    } finally {
      setLoading(false);
    }
  };

  // tanstack-react-query
  const {
    data,
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading || loading) {
    return <TableLoadingShimmer heading="Product" />;
  }

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {data.length > 0 ? (
          <div className="table-responsive">
            <Table
              hover
              className="user-table min-height"
              style={{ minWidth: "800px" }}
            >
              <thead>
                <tr>
                  <th className="border-bottom">SNo.</th>
                  <th className="border-bottom">Image</th>
                  <th className="border-bottom">Name</th>
                  <th className="border-bottom">Category</th>
                  <th className="border-bottom">Price</th>
                  <th className="border-bottom">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((prod, index) => (
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
                              handleEdit(prod.id);
                            }}
                            className="d-flex align-items-center gap-1"
                          >
                            <FaEdit /> <span>Edit</span>
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger d-flex align-items-center gap-1"
                            onClick={() => handleDelete(prod.id)}
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

      {/* Add/Edit Modal */}
      <AddEditProductModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditId(null);
        }}
        initialData={initialData}
      />
    </Card>
  );
};

export default ProductsTable;
