import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "../../axios"; // your axios instance
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ImageUploader from "../layout/ImageUploader";
import Select from "react-select";
import { valuehandler } from "../../utils/helper";

const AddEditProductModal = ({ show, onClose, initialData = null }) => {
  const queryClient = useQueryClient();
  const [image, setImage] = useState("");
  const initialFormState = {
    // image: "",
    name: "",
    price: "",
    priceDiscount: "",
    brand: "",
    countInStock: "",
    category: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);

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
        return await axios({
          method: "POST",
          url: "/dashboard/products",
          data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
    const form = new FormData();
    form.set("image", image);
    for (const key in formData) {
      if (key === "category") {
        form.append("productCategoryId", formData[key].value);
      } else {
        console.log(formData[key], "form ka data");
        form.append(key, formData[key]);
      }
    }
    console.log(form, "form hia na");
    mutation.mutate(form);
  };
  const fetchProductCategories = async () => {
    const res = await axios.get("/dashboard/product-categories");
    return res.data.data;
  };

  const { data: productCategories = [] } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
  });
  const productCategoriesOptions = productCategories.map((prodCat) => ({
    label: prodCat.name,
    value: prodCat._id,
  }));

  const handleCloseAndClearState = () => {
    onClose();
    setFormData(initialFormState);
    setImage("");
  };
  console.log(formData, "form hai na");
  return (
    <Modal show={show} onHide={handleCloseAndClearState} centered size="xl">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? "Edit" : "Add"} Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-5">
            <Col className=" d-flex justify-content-center">
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
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  placeholder="Enter Product's Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price Discount</Form.Label>
                <Form.Control
                  type="text"
                  name="priceDiscount"
                  placeholder="Enter Price Dicount"
                  value={formData.priceDiscount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  placeholder="Enter Brand Name"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Select
                  name="category"
                  placeholder="Please select the category"
                  value={valuehandler(
                    productCategoriesOptions,
                    formData.category
                  )}
                  options={productCategoriesOptions}
                  onChange={(data) =>
                    setFormData({ ...formData, category: data })
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Count in stock</Form.Label>
                <Form.Control
                  type="number"
                  name="countInStock"
                  placeholder="Enter count in Stock "
                  value={formData.countInStock}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleCloseAndClearState}>
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
