import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

interface StarRatingInputProps {
  rating: number;
  setRating: (star: number) => void;
  disabled: boolean;
}

const StarRatingInput = ({ rating, setRating, disabled }: StarRatingInputProps) => {
  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          style={{ cursor: disabled ? 'default' : 'pointer' }}
          color={star <= rating ? '#ffc107' : '#e4e5e9'}
          onClick={() => !disabled && setRating(star)}
        />
      ))}
    </div>
  );
};

StarRatingInput.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default StarRatingInput;
