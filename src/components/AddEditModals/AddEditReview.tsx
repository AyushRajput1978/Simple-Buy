import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { BsChatQuote } from 'react-icons/bs';
import { FaImages } from 'react-icons/fa';
import type { Review } from 'type';

import axios from '../../axios';
import { handleChange, toast } from '../../utils/helper';
import MultImageUploader from '../layout/MultiImageUploader';
import StarRatingInput from '../layout/StarRatingsInput';

interface AddEditReviewProps {
  productId: string;
  show: boolean;
  onClose: () => void;
  initialData: ReviewFormState | null;
  onUpdated: () => void;
}
interface ApiResponse {
  data: Review;
  status?: number;
  statusText?: string;
}
type ReviewFormState = {
  product: string;
  rating: number;
  comment: string;
  images: (File | string)[];
  id: string;
};

const AddEditReview = ({
  productId,
  show,
  onClose,
  initialData = null,
  onUpdated,
}: AddEditReviewProps) => {
  const initialFormState: ReviewFormState = {
    images: [],
    product: productId,
    rating: 0,
    comment: '',
    id: '',
  };
  const queryClient = useQueryClient();

  const [galleryImages, setGalleryImages] = useState<(string | File)[]>([]);
  const [formData, setFormData] = useState<ReviewFormState>(initialFormState);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setGalleryImages([...initialData.images]);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, images: [...galleryImages] }));
  }, [galleryImages]);

  const { mutate, isPending } = useMutation<ApiResponse, Error, FormData>({
    mutationFn: async (data) => {
      const url = initialData ? `/reviews/${initialData.id}` : '/reviews';
      const method = initialData ? 'PATCH' : 'POST';

      return await axios({
        method,
        url,
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['add-edit-reviews'] });
      onUpdated();
      handleCloseAndReset();
    },
    onError: (error) => {
      console.error('Failed to submit:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!formData.rating || formData.rating < 1) {
      toast('Please select a rating before submitting your review.', false);
      return;
    }
    if (!formData.comment || formData.comment.trim().length === 0) {
      toast('Please write a comment before submitting your review.', false);
      return;
    }

    const form = new FormData();
    // Append fields explicitly (avoid for..in with string indexing)
    form.append('product', formData.product);
    form.append('rating', String(formData.rating));
    form.append('comment', formData.comment);

    for (const item of formData.images) {
      // FormData.append accepts string | Blob; File extends Blob
      if (item instanceof Blob) {
        form.append('images', item);
      } else {
        // If your backend expects files only, convert data URLs/URLs to Blob before appending.
        form.append('images', item);
      }
    }

    mutate(form);
  };

  const handleCloseAndReset = () => {
    onClose();
    setFormData(initialFormState);
    setGalleryImages([]);
  };

  return (
    <Modal show={show} onHide={handleCloseAndReset} centered size="lg" className="review-modal">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 pb-0 mb-4">
          <Modal.Title className="w-100 text-center fs-4 fw-semibold text-primary">
            {initialData ? 'Edit Your Review ✏️' : 'Write a Review 📝'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-0">
          <Row className="mb-3">
            <Col>
              <h5 className="text-center fw-semibold mb-3">
                <FaImages className="me-2 text-primary" />
                Upload Review Gallery
              </h5>
              <MultImageUploader images={galleryImages} setImages={setGalleryImages} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label className="fw-semibold">Rating</Form.Label>
              <StarRatingInput
                rating={formData.rating || 0}
                setRating={(val: number) => setFormData((prev) => ({ ...prev, rating: val }))}
                disabled={isPending}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label>
                  <BsChatQuote className="me-1 text-secondary" />
                  Comment
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="comment"
                  placeholder="Write your thoughts about this product..."
                  value={formData.comment}
                  onChange={(e) => handleChange(e, setFormData)}
                  disabled={isPending}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between border-0 pt-0">
          <Button variant="outline-secondary" disabled={isPending} onClick={handleCloseAndReset}>
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : initialData ? 'Update Review' : 'Add Review'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditReview;
