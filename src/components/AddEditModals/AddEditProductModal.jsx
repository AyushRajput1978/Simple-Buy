import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "../../axios"; // your axios instance
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUploader from "../layout/ImageUploader";

const AddEditProductModal = ({ show, onClose, initialData = null }) => {
  const queryClient = useQueryClient();
  const [image, setImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priceDiscount: "",
    description: "",
    brand: "",
    countInStock: "",
    category: { id: null, name: "" },
    image: "",
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
      setImage(initialData.image);
    }
  }, [initialData, show]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (initialData) {
        return await axios.patch(
          `/dashboard/products/${initialData._id}`,
          data
        );
      } else {
        return await axios.post("/dashboard/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["add-edit-products"]);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to submit:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? "Edit" : "Add"} Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col className="mb-6 d-flex justify-content-center">
              <ImageUploader img={image} setImg={setImage} size="1920 X 400" />
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Product name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Saving..." : initialData ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

AddEditProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object, // optional
};

export default AddEditProductModal;
