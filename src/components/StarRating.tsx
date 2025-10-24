import { useState } from "react";

interface StarRatingProps {
  onRatingSubmit: (rating: number) => void;
  isSubmitted?: boolean;
  submittedRating?: number;
}

export function StarRating({ onRatingSubmit, isSubmitted = false, submittedRating = 0 }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleStarClick = (rating: number) => {
    if (!isSubmitted) {
      setSelectedRating(rating);
      onRatingSubmit(rating);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!isSubmitted) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!isSubmitted) {
      setHoveredRating(0);
    }
  };

  const getStarColor = (starIndex: number) => {
    const currentRating = isSubmitted ? submittedRating : (hoveredRating > 0 ? hoveredRating : selectedRating);
    
    if (starIndex <= currentRating) {
      return "text-yellow-400";
    }
    return "text-gray-300 dark:text-gray-600";
  };

  const getStarIcon = (starIndex: number) => {
    const currentRating = isSubmitted ? submittedRating : (hoveredRating > 0 ? hoveredRating : selectedRating);
    
    if (starIndex <= currentRating) {
      return "★";
    }
    return "☆";
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {isSubmitted ? "Thank you for your feedback!" : "How was your session?"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isSubmitted 
              ? "Your rating helps us improve the coaching experience."
              : "Please rate your overall experience with this coaching session."
            }
          </p>
        </div>
        
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleMouseLeave}
              disabled={isSubmitted}
              className={`
                text-3xl transition-all duration-200 transform hover:scale-110
                ${getStarColor(star)}
                ${isSubmitted ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              {getStarIcon(star)}
            </button>
          ))}
        </div>
        
        {!isSubmitted && selectedRating > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedRating === 1 && "Poor"}
            {selectedRating === 2 && "Fair"}
            {selectedRating === 3 && "Good"}
            {selectedRating === 4 && "Very Good"}
            {selectedRating === 5 && "Excellent"}
          </div>
        )}
        
        {isSubmitted && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Rating submitted successfully
          </div>
        )}
      </div>
    </div>
  );
}
