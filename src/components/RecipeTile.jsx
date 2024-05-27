import { Card, Button, Col } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import FavoriteButton from "../components/FavoriteButton.jsx";
import StarRating from "../components/StarRating.jsx";
import icons from "./../icon-data.js";
import { Link, useNavigate } from "react-router-dom";
import { authInfo, isLoggedIn } from "../services/authUtils.jsx";

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

// Returns a string in the form of "X h. Y min."
export function timeFormat(minutes) {
  let m = minutes % 60;
  let h = Math.floor(minutes / 60);
  if (m == 0) m = "";
  else m = m + " min. ";
  if (h == 0) h = "";
  else h = h + " h. ";
  return (h + m).trim();
}

export default function RecipeTile(props) {
  const navigate = useNavigate();
  return (
    <Col className="col-lg-3 col-md-4 col-sm-6 col-12">
      <Card className="recipe-tile" key={props.id}>
        <div className="d-flex justify-content-between align-items-start m-3 me-0 mt-0 recipe-tile__header">
          <Card.Title
            className={
              "mb-0 mt-3 recipe-tile__title " + (!isLoggedIn() ? "me-3" : null)
            }
          >
            {props.recipeTitle}
          </Card.Title>
          <div className="recipe-tile__fav-btn">
            <FavoriteButton recipeId={props.recipeId} />
          </div>
        </div>
        <div
          className="recipe-tile__img-wrapper overflow-hidden d-block"
          onClick={() => navigate("/view/" + props.recipeId)}
        >
          {/* A lable for the "What's in the fridge?" sort
              showing the number of matching tags */}
          {props?.matchRate !== undefined ? (
            <div className="recipe-tile__img-wrapper-label position-absolute p-2 z-1 m-2 d-flex flex-column justify-content-center align-items-center rounded">
              <span className="lh-sm">{props.matchRate + "%"}</span>
              <ReactSVG
                src={icons.tags}
                className="recipe-tile__cooking-time-icon"
              />
            </div>
          ) : null}
          {/* ---------------------------------- */}
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
              <span>{timeFormat(props.cookTime)}</span>
            </div>
            <StarRating rating={ratingRounded(props.rating)} />
          </div>
          <div className="d-flex flex-column justify-content-start">
            {authInfo() === props.username ? (
              <Link to={"/editor/" + props.recipeId}>
                <Button className="icon-button" variant="warning">
                  <ReactSVG src={icons.pencil} />
                </Button>
              </Link>
            ) : null}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
