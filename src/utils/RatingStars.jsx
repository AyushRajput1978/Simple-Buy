import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
const RatingStars = ({ ratings, reviews }) => {
  const fullStars = Math.floor(ratings || 5);
  const halfStar = ratings % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div
      className={`lead d-flex gap-2 align-items-center ${
        reviews ? "justify-content-center" : ""
      }`}
    >
      {[...Array(fullStars)]?.map((_, i) => (
        <FaStar key={`full-${i}`} color="#333" size={20} />
      ))}
      {halfStar && <FaStarHalfAlt color="#333" size={20} />}
      {[...Array(emptyStars)]?.map((_, i) => (
        <FaRegStar key={`empty-${i}`} color="#333" size={20} />
      ))}
    </div>
  );
};
export default RatingStars;
