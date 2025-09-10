import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, OverlayTrigger, FormLabel, Tooltip } from 'react-bootstrap';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import Select from 'react-select';
import type { ProductResponse, ProductType, Variant } from 'type';

import axios from '../../axios';
import { handleChange, toast } from '../../utils/helper';
import ImageUploader from '../layout/ImageUploader';

interface AddEditProductModalProps {
  show: boolean;
  onClose: () => void;
  initialData: ProductType | null;
}
interface ApiResponse {
  data: ProductType;
  status?: number;
  statusText?: string;
}
interface FormState {
  image: string | File;
  name: string;
  price: number;
  priceDiscount: number;
  brand: string;
  category: { label: string; value: string };
  description: string;
  variants: Variant[];
}
type SimpleField = 'name' | 'price' | 'priceDiscount' | 'brand';
const initialFormState: FormState = {
  image: '',
  name: '',
  price: 0,
  priceDiscount: 0,
  brand: '',
  category: { label: '', value: '' },
  description: '',
  variants: [{ id: '', attributeName: '', attributeValue: '', regularPrice: 0, countInStock: 0 }],
};

const AddEditProductModal = ({ show, onClose, initialData = null }: AddEditProductModalProps) => {
  const [image, setImage] = useState<string | File>('');
  const [formData, setFormData] = useState<FormState>(initialFormState);

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
    setFormData((prevData) => ({ ...prevData, image }));
  }, [image]);

  const fetchProductCategories = async (): Promise<ProductType[]> => {
    const res = await axios.get<ProductResponse>('/dashboard/product-categories');
    return res.data.data;
  };

  const { data: productCategories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: fetchProductCategories,
  });
  const productCategoriesOptions = productCategories.map((prodCat) => ({
    label: prodCat.name,
    value: prodCat._id,
  }));

  const { mutate, isPending } = useMutation<ApiResponse, Error, FormData>({
    mutationFn: async (data) => {
      const method = initialData ? 'PATCH' : 'POST';
      const url = initialData ? `/dashboard/products/${initialData._id}` : '/dashboard/products';
      return await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['add-edit-products'] });
      toast(`Product ${initialData ? 'updated' : 'added'} successfully`);
      handleCloseAndClear();
    },
    onError: (error) => {
      console.error('Failed to submit:', error);
    },
  });
  const handleAttributeChange = <K extends keyof Variant>(
    index: number,
    key: K,
    newValue: Variant[K],
  ) => {
    setFormData((prev) => {
      const variants = prev.variants.slice();
      variants[index] = { ...variants[index], [key]: newValue } as Variant;
      return { ...prev, variants };
    });
  };

  const handleAddAttribute = () => {
    setFormData((prevForm) => ({
      ...prevForm,
      variants: [
        ...prevForm.variants,
        { id: '', attributeName: '', attributeValue: '', regularPrice: 0, countInStock: 0 },
      ],
    }));
  };
  const handleRemoveAttribute = (index: number) => {
    setFormData((prevForm) => {
      const updatedVariants = [...prevForm.variants];
      updatedVariants.splice(index, 1);
      return { ...prevForm, variants: updatedVariants };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('productCategoryId', formData.category.value);
    form.append('image', formData.image);
    form.append('name', formData.name);
    form.append('price', String(formData.price));
    form.append('priceDiscount', String(formData.priceDiscount));
    form.append('brand', formData.brand);
    form.append('description', formData.description);
    formData.variants.forEach((v) => form.append('variants', JSON.stringify(v)));
    mutate(form);
  };

  const handleCloseAndClear = () => {
    onClose();
    setFormData(initialFormState);
    setImage('');
  };

  const simpleFields: Array<{
    label: string;
    name: SimpleField;
    type: 'text' | 'number';
    placeholder: string;
    required?: boolean;
  }> = [
    {
      label: "Product's Name",
      name: 'name',
      type: 'text',
      placeholder: 'eg: Roadster half sleeve t-shirt',
      required: true,
    },
    { label: 'Price', name: 'price', type: 'number', placeholder: 'eg: 199', required: true },
    { label: 'Price Discount', name: 'priceDiscount', type: 'number', placeholder: 'eg: 10' },
    { label: 'Brand', name: 'brand', type: 'text', placeholder: 'Roadster' },
  ];

  return (
    <Modal show={show} onHide={handleCloseAndClear} centered size="xl">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? 'Edit' : 'Add'} Product</Modal.Title>
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
            {simpleFields.map((field) => (
              <Col lg={3} md={4} key={field.name}>
                <Form.Group className="mb-3">
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, setFormData)}
                    disabled={isPending}
                    required={field.required}
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
                  onChange={(opt) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: opt ?? prev.category,
                    }))
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
                  rows={3}
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
                    onChange={(e) => handleAttributeChange(index, 'attributeName', e.target.value)}
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
                  <Form.Label className="fontweigh-500">Attribute Value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter attribute value"
                    value={varnt.attributeValue}
                    onChange={(e) => handleAttributeChange(index, 'attributeValue', e.target.value)}
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
                  <Form.Label className="fontweigh-500">Regular Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Regular Price"
                    value={varnt.regularPrice}
                    onChange={(e) =>
                      handleAttributeChange(index, 'regularPrice', Number(e.target.value))
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
                      handleAttributeChange(index, 'countInStock', Number(e.target.value))
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
                    style={{ cursor: 'pointer' }}
                  />
                )}
                {index === formData.variants.length - 1 && (
                  <Button variant="outline-primary" onClick={handleAddAttribute}>
                    Add More
                  </Button>
                )}
              </Col>
            </Row>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" disabled={isPending} onClick={handleCloseAndClear}>
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : initialData ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditProductModal;
