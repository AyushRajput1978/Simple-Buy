import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";

import ImageUploader from "../layout/ImageUploader";
import axios from "../../axios";
import { handleChange } from "../../utils/helper";

const initialFormState = {
  // image: "",
  name: "",
  price: null,
  priceDiscount: null,
  brand: "",
  countInStock: null,
  category: "",
  description: "",
};
const AddEditProductModal = ({ show, onClose, initialData = null }) => {
  const [image, setImage] = useState("");
  const [formData, setFormData] = useState(initialFormState);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        category: {
          label: initialData.category.name,
          value: initialData.category._id,
        },
      });
      setImage(initialData.image);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData({ ...formData, image });
  }, [image]);

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData
        ? `/dashboard/products/${initialData._id}`
        : "/dashboard/products";
      return await axios({
        method,
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["add-edit-products"]);
      handleCloseAndClear();
    },
    onError: (error) => {
      console.error("Failed to submit:", error);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      const value = formData[key];
      if (key === "category" && value?.value) {
        form.append("productCategoryId", value.value);
      } else {
        form.append(key, value);
      }
    }
    mutate(form);
  };

  const handleCloseAndClear = () => {
    onClose();
    setFormData(initialFormState);
    setImage("");
  };
  return (
    <Modal show={show} onHide={handleCloseAndClear} centered size="xl">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? "Edit" : "Add"} Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-5">
            <Col className=" d-flex justify-content-center">
              <ImageUploader
                img={image}
                setImg={setImage}
                size="1920 X 400"
                isLoading={isPending}
              />
            </Col>
          </Row>
          <Row>
            {[
              {
                label: "Product's Name",
                name: "name",
                type: "text",
                placeholder: "eg: Roadster half sleeve t-shirt",
                required: true,
              },
              {
                label: "Price",
                name: "price",
                type: "number",
                placeholder: "eg: 199",
                required: true,
              },
              {
                label: "Price Discount",
                name: "priceDiscount",
                type: "number",
                placeholder: "eg: 10",
              },
              {
                label: "Brand",
                name: "brand",
                type: "text",
                placeholder: "Roadster",
              },
              {
                name: "countInStock",
                label: "Count In Stock",
                type: "number",
                placeholder: "Enter Count in Stock",
              },
            ].map(({ name, label, type, placeholder }) => (
              <Col lg={3} md={4} key={name}>
                <Form.Group className="mb-3">
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    type={type}
                    name={name}
                    value={formData[name]}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e, setFormData)}
                    disabled={isPending}
                    required={name === "name" || name === "price"}
                  />
                </Form.Group>
              </Col>
            ))}
            <Col lg={3} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Select
                  name="category"
                  placeholder="Please select the category"
                  value={formData.category}
                  options={productCategoriesOptions}
                  onChange={(data) =>
                    setFormData({ ...formData, category: data })
                  }
                  isDisabled={isPending}
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
                  onChange={(e) => handleChange(e, setFormData)}
                  disabled={isPending}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            disabled={isPending}
            onClick={handleCloseAndClear}
          >
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

AddEditProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddEditProductModal;
