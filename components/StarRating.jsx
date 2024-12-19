import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  onRatingChange, 
  initialRating = 0 
}) => {
  const [rating, setRating] = useState(initialRating);

  // UseEffect to handle changes to initialRating prop
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleStarPress = (selectedRating) => {
    // Update rating state
    setRating(selectedRating);

    // Call the optional callback if provided
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <button 
          key={starNumber}
          onClick={() => handleStarPress(starNumber)}
          className="focus:outline-none"
          type="button"
        >
          <Star 
            size={40} 
            className={`cursor-pointer transition-colors duration-200 ${
              starNumber <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};


export default StarRating;