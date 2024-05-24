import { Card, Button, Col } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import FavoriteButton from "./FavoriteButton.jsx";
import StarRating from "./StarRating.jsx";
import icons from "../icon-data.js";
import { Link, useNavigate } from "react-router-dom";
import { authInfo } from "../services/authUtils.jsx";

export default function NewRecipeTile(props) {
  const navigate = useNavigate();
  return (
    <Col className="col-lg-3 col-md-4 col-sm-6 col-12">
      <Card className="recipe-tile" onClick={() => navigate("/editor/")}>
        {/* ======================================================================= */}
        <div className="position-absolute w-100 h-100 d-flex new-recipe-tile p-1">
          <div className="new-recipe-tile__dash-box p-3 d-flex flex-grow-1 justify-content-center align-items-center rounded">
            <div className="new-recipe-tile__content d-flex flex-column justify-content-center align-items-center gap-2">
              <div className="new-recipe-tile__icon-wrapper">
                <ReactSVG src={icons.plus} />
              </div>
              <h3 className="m-0 text-center">New recipe</h3>
            </div>
          </div>
        </div>
        {/* Everything below is empty, and it keeps the card from chagning its size */}
        {/* ======================================================================= */}
        <div className="d-flex justify-content-between align-items-start m-3 me-0 mt-0 recipe-tile__header">
          <Card.Title className="mb-0 mt-3 recipe-tile__title"></Card.Title>
        </div>
        <div className="recipe-tile__img-wrapper overflow-hidden invisible">
          <Card.Img variant="middle" />
        </div>
        <Card.Body className="d-flex justify-content-between align-items-end invisible">
          <div className="recipe-tile__info mb-0">
            <span>.</span>
            <div className="d-flex gap-2 align-items-center">
              <ReactSVG
                src={icons.clock}
                className="recipe-tile__cooking-time-icon"
              />
              <span></span>
            </div>
            <StarRating />
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
