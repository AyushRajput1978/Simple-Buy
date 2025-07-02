import { format } from "date-fns";
import RatingStars from "../utils/RatingStars";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Stack,
} from "react-bootstrap";
import { useEffect, useReducer, useState } from "react";
import AddEditReview from "./AddEditModals/AddEditReview";
import axios from "../axios";
import CustomToast from "./layout/CustomToast";
import { useSelector } from "react-redux";
import ConfirmModal from "./layout/AlertModal";

const Reviews = ({
  productId,
  reviews,
  reviewsCount,
  ratingsAverage,
  refetchProductDetail,
}) => {
  const initialState = {
    showToast: false,
    toastBody: "",
    success: true,
  };

  const toastReducer = (state, action) => {
    switch (action.type) {
      case "SHOW_TOAST":
        return {
          ...state,
          showToast: true,
          toastBody: action.payload,
          success: action.success,
        };
      case "HIDE_TOAST":
        return { ...state, showToast: false };
      default:
        return state;
    }
  };

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toastState, dispatchToast] = useReducer(toastReducer, initialState);
  const [restrictAddReview, setRestrictAddReview] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  const userData = useSelector((state) => state.auth.user);

  const handleAddReview = () => {
    if (restrictAddReview) {
      dispatchToast({
        type: "SHOW_TOAST",
        payload: "You are allowed to add one review per product",
        success: false,
      });
      return;
    }
    setEditData(null);
    setOpenReviewModal(true);
  };

  const handleEditReview = (review) => {
    setEditData({
      product: review.product,
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: [...review.images],
    });
    setOpenReviewModal(true);
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`/reviews/${id}`);
      dispatchToast({
        type: "SHOW_TOAST",
        payload: "Review deleted successfully",
        success: true,
      });
      refetchProductDetail();
    } catch (err) {
      console.error(err);
      dispatchToast({
        type: "SHOW_TOAST",
        payload: err.response?.data?.message || "Something went wrong",
        success: false,
      });
    }
  };
  const handleConfirmDelete = () => {
    deleteReview(reviewId);
    setShowConfirmModal(false);
    setReviewId(null);
  };
  useEffect(() => {
    reviews.forEach((review) => {
      review.user.id === userData.id && setRestrictAddReview(true);
    });
  }, [reviews]);
  return (
    <Container className="my-5 reviews-container">
      <div className="text-center mb-5">
        <h2 className="fw-bold">
          Reviews <span className="fs-5 text-muted">({reviewsCount})</span>
        </h2>
        <h5 className="text-secondary mb-2">What Customers Think</h5>
        <div className="d-flex justify-content-center align-items-center">
          <RatingStars ratings={ratingsAverage} reviews={true} />
          <span className="ms-2 fw-semibold">{ratingsAverage}</span>
        </div>
        <p className="text-muted mt-2">
          Based on {reviewsCount} customer{reviewsCount !== 1 && "s"} reviews
        </p>
      </div>

      {reviews?.length === 0 ? (
        <p className="text-center text-muted">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <Row className="g-4">
          {reviews.map((review) => (
            <Col md={6} key={review.id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <RatingStars ratings={review.rating} />
                    <small className="text-muted">
                      {format(new Date(review.createdAt), "dd MMM yyyy")}
                    </small>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={review.user.photo}
                      roundedCircle
                      width={45}
                      height={45}
                      className="me-2 border"
                    />
                    <strong>{review.user?.name}</strong>
                  </div>

                  <Card.Text className="text-dark">{review.comment}</Card.Text>

                  {review.images?.length > 0 && (
                    <Row className="g-2 mb-3">
                      {review.images.map((image, idx) => (
                        <Col xs={4} sm={3} lg={2} key={image}>
                          <Image
                            src={image}
                            thumbnail
                            width={100}
                            height={100}
                            className="border rounded"
                            style={{ cursor: "pointer" }}
                            onClick={() => window.open(image, "_blank")}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}

                  {userData.id === review.user.id && (
                    <Stack direction="horizontal" gap={2}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setShowConfirmModal(true);
                          setReviewId(review.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="text-center mt-5">
        <Button variant="dark" size="lg" onClick={handleAddReview}>
          Write a Review
        </Button>
      </div>

      <AddEditReview
        productId={productId}
        show={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        initialData={editData}
        onUpdated={refetchProductDetail}
      />
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleClearConfirm={handleConfirmDelete}
        heading="Confirm Delete Review"
        bodyText="Are you sure you want to your review?"
        confirmText="Yes, delete review"
      />
      <CustomToast
        show={toastState.showToast}
        toastBody={toastState.toastBody}
        setShow={() => dispatchToast({ type: "HIDE_TOAST" })}
        success={toastState.success}
      />
    </Container>
  );
};

export default Reviews;
