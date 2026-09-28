import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 0,
  interactive = false,
  onRate,
  size = 18,
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.round(displayRating);
          return (
            <Star
              key={starIndex}
              size={size}
              className={`star ${isFilled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
              fill={isFilled ? '#fbbf24' : 'transparent'}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRate && onRate(starIndex)}
            />
          );
        })}
      </div>
      {showValue && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
