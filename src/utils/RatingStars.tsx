import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingStarsProps {
  ratings: number; // expected 0..5 (can be decimal)
  reviews?: boolean;
}

const RatingStars = ({ ratings, reviews }: RatingStarsProps) => {
  const safe = Number.isFinite(ratings) ? Math.min(5, Math.max(0, ratings)) : 0;

  const stars = Array.from({ length: 5 }, (_, i) => {
    const threshold = i + 1;
    if (safe >= threshold) return { type: 'full' as const };
    if (safe >= threshold - 0.5) return { type: 'half' as const };
    return { type: 'empty' as const };
  });

  return (
    <div
      className={`lead d-flex gap-2 align-items-center ${reviews ? 'justify-content-center' : ''}`}
    >
      {stars.map((s, i) => {
        const key = `star-${i}`;
        if (s.type === 'full') return <FaStar key={key} size={20} />;
        if (s.type === 'half') return <FaStarHalfAlt key={key} size={20} />;
        return <FaRegStar key={key} size={20} />;
      })}
    </div>
  );
};

export default RatingStars;
