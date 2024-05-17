import { Card, Button, Col } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import FavoriteButton from "../components/FavoriteButton.jsx";
import icons from "../icon-data.js";
import { Link } from "react-router-dom";

// Converts a numerical rating to an array of star icons
function RatingToStars({ rating }) {
  rating = Math.round(rating * 2) * 0.5;
  var stars = [];
  // Star SVG icons
  for (var i = 0; i < 5; i++) {
    if (rating >= 1) {
      stars.push(<ReactSVG src={icons.starFull} />);
      rating--;
    } else if (rating >= 0.5) {
      stars.push(<ReactSVG src={icons.starHalf} />);
      rating -= 0.5;
    } else stars.push(<ReactSVG src={icons.starEmpty} />);
  }
  return stars;
}

// Rounds a numerical rating up to 1 digit
function ratingRounded(rating) {
  rating = Math.round(rating * 2) * 0.5;
  return rating;
}

export default function RecipeTile(props) {
  return (
    <Col className="col-lg-3 col-md-4 col-sm-6 col-12">
      <Card className="recipe-tile" key={props.id}>
        <div className="d-flex justify-content-between align-content-center recipe-tile__header">
          <Card.Body>
            <Card.Title className="m-0">{props.recipeTitle}</Card.Title>
          </Card.Body>
          <FavoriteButton />
        </div>
        <div className="recipe-tile__img-wrapper">
          <Card.Img variant="middle" src={props.image} />
        </div>
        <Card.Body className="d-flex justify-content-between align-items-end">
          <div className="recipe-tile__info mb-0">
            <span>by {props.username}</span>
            <div className="d-flex gap-2 align-items-center">
              <ReactSVG
                src={icons.clock}
                className="recipe-tile__cooking-time-icon"
              />
              <span>{props.cookTime} min.</span>
            </div>
            <div className="star-rating gap-1">
              <div className="star-rating__icons d-flex">
                <RatingToStars rating={props.rating} />
              </div>
              <div className="star-rating__number">
                ({ratingRounded(props.rating)})
              </div>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <Link to={"/editor/" + props.recipeId}>
              <Button variant="warning">Edit</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
