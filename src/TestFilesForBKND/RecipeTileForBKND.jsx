import { Card, Button, Col } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import FavoriteButton from "../components/FavoriteButton.jsx";
import StarRating from "../components/StarRating.jsx";
import icons from "./../icon-data.js";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../services/authUtils.jsx";

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
  return (
    <Col className="col-lg-3 col-md-4 col-sm-6 col-12">
      <Card className="recipe-tile" key={props.id}>
        <div className="d-flex justify-content-between align-items-start m-3 me-0 mt-0 recipe-tile__header">
          <Card.Title className="mb-0 mt-3 recipe-tile__title">
            {props.recipeTitle}
          </Card.Title>
          <div className="recipe-tile__fav-btn">
            <FavoriteButton />
          </div>
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
              <span>{timeFormat(props.cookTime)}</span>
            </div>
            <StarRating rating={props.rating} />
          </div>
          <div className="d-flex flex-column gap-2">
            {isLoggedIn() ? (
              <Link to={"/editor/" + props.recipeId}>
                <Button variant="warning">Edit</Button>
              </Link>
            ) : (
              <></>
            )}
            <Link to={"/view/" + props.recipeId}>
              <Button variant="primary">View</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
