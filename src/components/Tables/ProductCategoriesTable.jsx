import axios from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { Table, Spinner, Dropdown, Card, ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import AddEditProductCategoriesModal from "../AddEditModals/AddEditProductCategoriesModal";

const ProductCategoriesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const fetchProductCategories = async () => {
    const res = await axios.get("/dashboard/product-categories");
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  const handleEdit = async (id) => {
    const res = await axios.get(`/dashboard/product-categories/${id}`);
    setInitialData(res.data.data);
    setShowModal(true);
  };
  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {data.length > 0 ? (
          <Table hover className="user-table min-height">
            <thead>
              <tr>
                <th className="border-bottom">SNo.</th>
                <th className="border-bottom">Name</th>

                <th className="border-bottom">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cat, index) => (
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
                            handleEdit(cat._id);
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
        ) : (
          <Row className="justify-content-center align-item-center text-dark fontweigh-500 p-4">
            {" "}
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
          setEditId(null);
        }}
        initialData={initialData}
      />
    </Card>
  );
};

export default ProductCategoriesTable;
