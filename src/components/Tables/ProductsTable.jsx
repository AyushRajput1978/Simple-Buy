import axios from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import {
  Table,
  Spinner,
  Dropdown,
  Card,
  ButtonGroup,
  Image,
} from "react-bootstrap";
import { useState } from "react";
import AddEditProductModal from "../AddEditModals/AddEditProductModal";

const ProductsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const fetchProducts = async () => {
    const res = await axios.get("/dashboard/products");
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  const handleEdit = async (id) => {
    const res = await axios.get(`/dashboard/products/${id}`);
    setInitialData(res.data.data);
    setShowModal(true);
  };
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
                  <tr key={prod._id}>
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
                      <span className="fw-normal">{prod.category}</span>
                    </td>
                    <td text-label="Price">
                      <span className="fw-normal">{prod.price}</span>
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup} drop="down-centered">
                        <Dropdown.Toggle
                          as="button"
                          className="btn btn-link text-dark m-0 p-0 border-0 shadow-none"
                          id={`dropdown-button-${prod._id}`}
                        >
                          <BsThreeDots size={18} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              handleEdit(prod._id);
                            }}
                            className="d-flex align-items-center gap-1"
                          >
                            <FaEdit /> <span>Edit</span>
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger d-flex align-items-center gap-1"
                            onClick={() => {}}
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
