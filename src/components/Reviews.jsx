import { format } from "date-fns";
import RatingStars from "../utils/RatingStars";

const Reviews = ({ reviews, reviewsCount, ratingsAverage }) => {
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
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id}>
            <div className="d-flex gap-2 mb-2">
              <RatingStars ratings={review.rating} />
              <p className="mb-0">{format(review.createdAt, "dd MMMM yyyy")}</p>
            </div>
            <strong>{review.user?.name}</strong>
            <p>{review.comment}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};
export default Reviews;
