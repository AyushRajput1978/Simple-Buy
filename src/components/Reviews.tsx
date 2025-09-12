import type { AxiosError } from 'axios';
import { format } from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import type { ApiError, Review, RootState } from 'type';

import axios from '../axios';
import AddEditReview from './AddEditModals/AddEditReview';
import RatingStars from '../utils/RatingStars';
import ConfirmModal from './layout/AlertModal';
import { toast } from '../utils/helper';

interface ReviewsProps {
  productId: string;
  reviews: Review[];
  reviewsCount: number;
  ratingsAverage: number;
  refetchProductDetail: () => void;
}

interface ReviewInitialData {
  product: string;
  id: string;
  rating: number;
  comment: string;
  images: string[];
}

const Reviews = ({
  productId,
  reviews,
  reviewsCount,
  ratingsAverage,
  refetchProductDetail,
}: ReviewsProps) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [editData, setEditData] = useState<ReviewInitialData | null>(null);
  const [restrictAddReviewMsg, setRestrictAddReviewMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewId, setReviewId] = useState('');

  const userData = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!userData) {
      setRestrictAddReviewMsg('Please login or signup to add a review');
    }
  }, [userData]);
  useEffect(() => {
    if (userData) {
      reviews.forEach((review) => {
        if (review.user.id === userData.id) {
          setRestrictAddReviewMsg('You are allowed to add one review per product');
        }
      });
    }
  }, [reviews]);

  const handleAddReview = () => {
    if (restrictAddReviewMsg) {
      toast(restrictAddReviewMsg, false);
      return;
    }
    setEditData(null);
    setOpenReviewModal(true);
  };
  const handleEditReview = (review: Review) => {
    setEditData({
      product: review.product,
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      images: [...review.images],
    });
    setOpenReviewModal(true);
  };
  const deleteReview = async (id: string) => {
    try {
      await axios.delete(`/reviews/${id}`);
      toast('Review deleted successfully');
      refetchProductDetail();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      toast(error.response?.data?.message || 'Something went wrong', false);
    }
  };
  const handleConfirmDelete = () => {
    void deleteReview(reviewId);
    setShowConfirmModal(false);
    setReviewId('');
  };

  return (
    <Container className="my-5 reviews-container">
      <div className="text-center mb-5">
        <h3 className="fw-bold text-primary">
          Reviews <span className="fs-5 text-muted">({reviewsCount})</span>
        </h3>
        {Boolean(reviewsCount) && (
          <Fragment>
            <h4 className="text-secondary mb-2">What Customers Think</h4>
            <div className="d-flex justify-content-center align-items-center">
              <RatingStars ratings={ratingsAverage} reviews={true} />
              <span className="ms-2 fw-semibold text-cta">{ratingsAverage}</span>
            </div>

            <p className="text-muted mt-2">
              Based on {reviewsCount} customer{reviewsCount !== 1 && 's'} reviews
            </p>
          </Fragment>
        )}
      </div>

      {reviews?.length === 0 ? (
        <p className="text-center text-muted">No reviews yet. Be the first to review!</p>
      ) : (
        <Row className="g-4">
          {reviews.map((review) => (
            <Col md={6} key={review.id}>
              <Card className="review-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <RatingStars ratings={review.rating} />
                    <small className="text-muted">
                      {format(new Date(review.createdAt), 'dd MMM yyyy')}
                    </small>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={review.user.photo}
                      roundedCircle
                      width={45}
                      height={45}
                      className="me-3 border"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="text-start">
                      <strong className="d-block">{review.user?.name}</strong>
                      <small className="text-muted">
                        {format(new Date(review.createdAt), 'dd MMM yyyy')}
                      </small>
                    </div>
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
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(image, '_blank')}
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
        <Button variant="primary" size="lg" onClick={handleAddReview}>
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
        handleConfirmClear={handleConfirmDelete}
        heading="Confirm Delete Review"
        bodyText="Are you sure you want to your review?"
        confirmText="Yes, delete review"
      />
    </Container>
  );
};

export default Reviews;
