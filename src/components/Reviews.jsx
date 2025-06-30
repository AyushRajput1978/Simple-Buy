import { format } from "date-fns";
import RatingStars from "../utils/RatingStars";
import { Button, Image } from "react-bootstrap";
import { useState } from "react";
import AddEditReview from "./AddEditModals/AddEditReview";

const Reviews = ({ productId, reviews, reviewsCount, ratingsAverage }) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const handleAddReview = () => {
    setOpenReviewModal(true);
  };
  return (
    <div>
      <div className="text-center mb-4">
        <h2 className=" mb-4">
          Reviews <span className="fs-5 text-muted">({reviewsCount})</span>
        </h2>
        <h3 className=" mb-4">WHAT OTHER CUSTOMERS THINK</h3>
        <div>
          <RatingStars ratings={ratingsAverage} reviews={true} />{" "}
          <span className="ms-2">{ratingsAverage}</span>
        </div>
        <p className="">Based on {reviewsCount} customers reviews</p>
      </div>
      {reviews?.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews?.map((review) => (
          <div key={review.id}>
            <div className="d-flex gap-2 mb-2">
              <RatingStars ratings={review.rating} />
              <p className="mb-0">{format(review.createdAt, "dd MMMM yyyy")}</p>
            </div>
            <div className="d-flex gap-3">
              <Image
                src={review.user.photo}
                alt="user prodile pic"
                width={40}
                height={40}
                className="rounded-circle"
              />
              <strong className="align-items-center d-flex">
                {review.user?.name}
              </strong>
            </div>
            <p className="my-4">{review.comment}</p>
            <div className="d-flex gap-4 mb-2">
              {review.images.map((image) => {
                return (
                  <Image
                    src={image}
                    width={70}
                    height={70}
                    className="rounded"
                  />
                );
              })}
            </div>
            <hr />
          </div>
        ))
      )}
      <Button variant="dark" onClick={handleAddReview}>
        Add Review
      </Button>
      <AddEditReview
        productId={productId}
        show={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
      />
    </div>
  );
};
export default Reviews;
