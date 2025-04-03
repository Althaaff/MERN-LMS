import { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingComponent = ({ rating, setRating, editable = true }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex gap-2">
      {[...Array(4)].map((_, index) => {
        const starValue = index + 1;

        return (
          <FaStar
            key={index}
            size={17}
            className="cursor-pointer transition-all duration-200"
            color={starValue <= (hover || rating) ? "#ffc107" : "e4e5e9"}
            onMouseEnter={() => editable && setHover(starValue)}
            onMouseLeave={() => editable && setHover(null)}
            onClick={() => editable && setRating(starValue)}
          />
        );
      })}
    </div>
  );
};

export default RatingComponent;
