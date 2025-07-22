import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaImages } from "react-icons/fa";
import { BsChatQuote } from "react-icons/bs";

import MultImageUploader from "../layout/MultiImageUploader";
import StarRatingInput from "../layout/StarRatingsInput";
import axios from "../../axios";
import { toast } from "../../utils/helper";

const AddEditReview = ({
  productId,
  show,
  onClose,
  initialData = null,
  onUpdated,
}) => {
  const initialFormState = {
    product: productId,
    rating: null,
    comment: "",
  };
  const queryClient = useQueryClient();

  const [galleryImages, setGalleryImages] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setGalleryImages([...initialData.images]);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, images: [...galleryImages] }));
  }, [galleryImages]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const url = initialData ? `/reviews/${initialData.id}` : "/reviews";
      const method = initialData ? "PATCH" : "POST";

      return await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["add-edit-reviews"]);
      onUpdated();
      handleCloseAndReset();
    },
    onError: (error) => {
      console.error("Failed to submit:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.rating || formData.rating < 1) {
      toast("Please select a rating before submitting your review.", false);
      return;
    }

    if (!formData.comment || formData.comment.trim().length === 0) {
      toast("Please write a comment before submitting your review.", false);
      return;
    }
    const form = new FormData();

    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((file) => {
          form.append("images", file);
        });
      } else {
        form.append(key, formData[key]);
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
    <Modal
      show={show}
      onHide={handleCloseAndReset}
      centered
      size="lg"
      className="review-modal"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 pb-0 mb-4">
          <Modal.Title className="w-100 text-center fs-4 fw-semibold text-primary">
            {initialData ? "Edit Your Review ✏️" : "Write a Review 📝"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-0">
          <Row className="mb-3">
            <Col>
              <h5 className="text-center fw-semibold mb-3">
                <FaImages className="me-2 text-primary" />
                Upload Review Gallery
              </h5>
              <MultImageUploader
                images={galleryImages}
                setImages={setGalleryImages}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label className="fw-semibold">Rating</Form.Label>
              <StarRatingInput
                rating={formData.rating || 0}
                setRating={(val) =>
                  setFormData((prev) => ({ ...prev, rating: val }))
                }
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
                  rows="3"
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
          <Button
            variant="outline-secondary"
            disabled={isPending}
            onClick={handleCloseAndReset}
          >
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : initialData
              ? "Update Review"
              : "Add Review"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

AddEditReview.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddEditReview;
