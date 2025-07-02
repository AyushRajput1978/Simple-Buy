import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MultImageUploader from "../layout/MultiImageUploader";
import { FaImages } from "react-icons/fa";
import { BsChatQuote } from "react-icons/bs";
import StarRatingInput from "../layout/StarRatingsInput";

const AddEditReview = ({
  productId,
  show,
  onClose,
  initialData = null,
  onUpdated,
}) => {
  const queryClient = useQueryClient();
  const [galleryImages, setGalleryImages] = useState([]);

  const initialFormState = {
    product: productId,
    rating: null,
    comment: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  // Pre-fill form on edit
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setGalleryImages([...initialData.images]);
    }
  }, [initialData, show]);

  // Sync images to formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, images: [...galleryImages] }));
  }, [galleryImages]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      if (initialData) {
        return await axios.patch(`/reviews/${initialData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        return await axios.post("/reviews", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["add-edit-reviews"]);
      onUpdated();
      handleCloseAndClearState();
    },
    onError: (error) => {
      console.error("Failed to submit:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const handleCloseAndClearState = () => {
    onClose();
    setFormData(initialFormState);
    setGalleryImages([]);
  };

  return (
    <Modal show={show} onHide={handleCloseAndClearState} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 pb-0 mb-4">
          <Modal.Title className="w-100 text-center">
            <span className="d-flex justify-content-center align-items-center gap-2">
              {initialData ? "Edit Review" : "Add Review"}
            </span>
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
                  onChange={handleChange}
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
            onClick={handleCloseAndClearState}
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
