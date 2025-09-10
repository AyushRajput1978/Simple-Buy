import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { ProductCategoryType } from 'type';

import axios from '../../axios';
import { handleChange, toast } from '../../utils/helper';

const initialFormState = { name: '' };

interface FormState {
  name: string;
}

interface ApiResponse {
  data: ProductCategoryType;
  status?: number;
  statusText?: string;
}

interface AddEditProductCategoriesModalProps {
  show: boolean;
  onClose: () => void;
  initialData?: ProductCategoryType | null;
}

const AddEditProductCategoriesModal = ({
  show,
  onClose,
  initialData = null,
}: AddEditProductCategoriesModalProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const mutation = useMutation<ApiResponse, Error, FormState>({
    mutationFn: async (data: FormState) => {
      if (initialData) {
        return await axios.patch(`/dashboard/product-categories/${initialData._id}`, data);
      } else {
        return await axios.post('/dashboard/product-categories', data);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      toast(`Product category ${initialData ? 'updated' : 'added'} successfully`);
      onClose();
    },
    onError: (error) => {
      toast(`Failed to submit:${error}`, false);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? 'Edit' : 'Add'} Category</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter category name"
              autoFocus
              value={formData.name}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="status"
              label="Active"
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group> */}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : initialData ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

AddEditProductCategoriesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddEditProductCategoriesModal;
