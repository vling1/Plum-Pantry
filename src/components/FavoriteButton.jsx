import { Button } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import icons from "./../icon-data.js";

function toggleFavorite() {}

export default function FavoriteButton() {
  return (
    <Button className="favorite-button" variant="">
      <ReactSVG src={icons.heartEmpty} className="favorite-button__fav-icon" />
    </Button>
  );
}
