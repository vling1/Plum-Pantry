import { Button } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import icons from "./../icon-data.js";

function toggleFavorite() {}

export default function FavoriteButton() {
  return (
    <Button className="align-self-start favorite-button me-2 mt-2" variant="">
      <ReactSVG src={icons.heartEmpty} className="favorite-button__fav-icon" />
    </Button>
  );
}
