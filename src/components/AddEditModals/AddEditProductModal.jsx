import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  OverlayTrigger,
  FormLabel,
  Tooltip,
} from "react-bootstrap";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
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
  variants: [
    {
      attributeName: "",
      attributeValue: "",
      regularPrice: 0,
      countInStock: 0,
    },
  ],
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
  const handleAttributeChange = (index, key, newValue) => {
    setFormData((prevForm) => {
      const updatedVariants = [...prevForm.variants];
      updatedVariants[index][key] = newValue;

      return {
        ...prevForm,
        variants: updatedVariants,
      };
    });
  };
  const handleAddAttribute = () => {
    setFormData((prevForm) => ({
      ...prevForm,
      variants: [
        ...prevForm.variants,
        {
          attributeName: "",
          attributeValue: "",
          regularPrice: 0,
          countInStock: 0,
        },
      ],
    }));
  };
  const handleRemoveAttribute = (index) => {
    setFormData((prevForm) => {
      const updatedVariants = [...prevForm.variants];
      updatedVariants.splice(index, 1);
      return { ...prevForm, variants: updatedVariants };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      const value = formData[key];
      if (key === "category" && value?.value) {
        form.append("productCategoryId", value.value);
      } else if (key === "variants") {
        formData.variants.forEach((varnt) => {
          form.append("variants", JSON.stringify(varnt));
        });
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
          {formData.variants?.map((varnt, index) => (
            <Row key={index} className="mb-3">
              <Col md={4} lg={3} xl={2}>
                <Form.Group controlId={`attributeName${index}`}>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="button-tooltip">
                        Attribute parameter eg: cm, inch, cloth size: S, M, L
                      </Tooltip>
                    }
                  >
                    <FormLabel className="fontweigh-500">
                      Attribute Name <FaInfoCircle />
                    </FormLabel>
                  </OverlayTrigger>
                  <Form.Control
                    type="text"
                    placeholder="Enter attribute name (e.g: cm, inch, cloth size: S, M, L)"
                    value={varnt.attributeName}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "attributeName",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
                {/* {error[`variant_attribute_name_${index}`] && (
                  <p className="text-danger">
                    {error[`variant_attribute_name_${index}`]}
                  </p>
                )} */}
              </Col>

              <Col md={4} lg={3} xl={2}>
                <Form.Group controlId={`attributeValue${index}`}>
                  <Form.Label className="fontweigh-500">
                    Attribute Value
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter attribute value"
                    value={varnt.attributeValue}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "attributeValue",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
                {/* {error[`variant_attribute_value_${index}`] && (
                  <p className="text-danger">
                    {error[`variant_attribute_value_${index}`]}
                  </p>
                )} */}
              </Col>
              <Col md={4} xl={2} lg={3}>
                <Form.Group controlId={`regularPrice${index}`}>
                  <Form.Label className="fontweigh-500">
                    Regular Price
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Regular Price"
                    value={varnt.regularPrice}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "regularPrice",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
                {/* {error[`variant_regular_price_${index}`] && (
                  <p className="text-danger">
                    {error[`variant_regular_price_${index}`]}
                  </p>
                )} */}
              </Col>

              <Col md={4} lg={2}>
                <Form.Group controlId={` countInStock${index}`}>
                  <Form.Label className="fontweigh-500">Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter stock quantity"
                    value={varnt.countInStock}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "countInStock",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
                {/* {error[`variant_stock_quantity_${index}`] && (
                  <p className="text-danger">
                    {error[`variant_stock_quantity_${index}`]}
                  </p>
                )} */}
              </Col>
              <Col md={4} lg={3} className="d-flex  align-items-center mt-4">
                {Boolean(formData.variants.length > 1) && (
                  <FaTrash
                    className="mr-4 text-danger"
                    onClick={() => handleRemoveAttribute(index)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                {index === formData.variants.length - 1 && (
                  <Button
                    variant="outline-primary"
                    onClick={handleAddAttribute}
                  >
                    Add More
                  </Button>
                )}
              </Col>
            </Row>
          ))}
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
