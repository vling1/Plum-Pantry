import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import icons from "../icon-data.js";
import { authInfo } from "../services/authUtils.jsx";
import Data from "../services/Data.jsx";

export default function StarRatingSelection({ recipeId }) {
  let stars = [1, 2, 3, 4, 5];
  const [selectedStar, setSelectedStar] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  function iconHandler(index) {
    if (hoveredStar)
      // Handling hover
      return index <= hoveredStar ? icons.starFull : icons.starEmpty;
    // Handling regular display
    else return index <= selectedStar ? icons.starFull : icons.starEmpty;
  }

  async function submitRating(rating) {
    const username = authInfo();
    if (username)
      Data.get("Users/" + username).then((user) => {
        Data.put("Recipes/update/rating/" + recipeId, {
          userId: user.userId,
          userR: rating,
        });
      });
  }

  // Fetching the innitial rating given by the user
  useEffect(() => {
    const username = authInfo();
    if (username)
      Data.get("Users/" + username).then((user) => {
        Data.get("Recipes/recipe/" + recipeId).then((recipe) => {
          const foundEntry = recipe.ratingDict?.find(
            (item) => item.userId === user.userId
          );
          if (foundEntry) setSelectedStar(foundEntry.userR);
        });
      });
  }, []);

  return (
    <div
      className="star-rating gap-2 flex align-items-center"
      onMouseOut={() => {
        // By default, no stars are highlighted on hover
        setHoveredStar(0);
        console.log("Hovered star:", 0);
      }}
    >
      <h4 className="p-0 m-0">Rate this recipe:</h4>
      <div className="d-flex flex-row gap-1 align-items-center">
        <div className="star-rating__icons-large d-flex flex-row align-items-center">
          {stars.map((i) => (
            <div
              className={
                hoveredStar ? "star-rating__star-hovered" : "star-rating__star"
              }
              onMouseOver={() => {
                // Update the state with the index of a star that is hovered over
                setHoveredStar(i);
                console.log("Hovered star:", i);
              }}
              onClick={() => {
                // Update the state with the index of a star that is clicked
                if (selectedStar != i) {
                  setSelectedStar(i);
                  submitRating(i);
                }
                // Deselection
                else {
                  setSelectedStar(0);
                  submitRating(0);
                }
              }}
            >
              <ReactSVG src={iconHandler(i)} key={i} />
            </div>
          ))}
        </div>
        <h4 className="p-0 m-0">({selectedStar})</h4>
      </div>
    </div>
  );
}
