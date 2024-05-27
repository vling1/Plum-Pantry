import { ReactSVG } from "react-svg";
import icons from "./../icon-data.js";

export default function StarRating({ rating }) {
  function RatingToStars({ rating }) {
    rating = Math.round(rating * 2) * 0.5;
    let stars = [];
    // Star SVG icons
    for (var i = 0; i < 5; i++) {
      if (rating >= 1) {
        stars.push(
          <div className="star-rating__star">
            <ReactSVG src={icons.starFull} key={i} />
          </div>
        );
        rating--;
      } else if (rating >= 0.5) {
        stars.push(
          <div className="star-rating__star">
            <ReactSVG src={icons.starHalf} key={i} />
          </div>
        );
        rating -= 0.5;
      } else
        stars.push(
          <div className="star-rating__star">
            <ReactSVG src={icons.starEmpty} key={i} />
          </div>
        );
    }
    return stars;
  }

  // Rounds a numerical rating up to 1 digit
  function ratingRounded(rating) {
    rating = Math.round(rating * 2) * 0.5;
    return rating;
  }

  return (
    <div className="star-rating gap-1">
      <div className="star-rating__icons d-flex">
        <RatingToStars rating={rating} />
      </div>
      <div className="star-rating__number">({ratingRounded(rating)})</div>
    </div>
  );
}
