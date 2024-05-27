import { Button } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import icons from "./../icon-data.js";
import Data from "../services/Data.jsx";
import { authInfo } from "../services/authUtils.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { resolvePath } from "react-router-dom";

export default function FavoriteButton({ recipeId = 12345 }) {
  let idIsSet = false;

  const [Id, setId] = useState(recipeId);
  const [active, setActive] = useState(false);

  useEffect(() => {
    //console.log("Favorite button | API call", Id);
    const username = authInfo();
    if (username)
      Data.get("Users/" + username).then((response) =>
        setActive(response?.favoriteRecipes.some((item) => item === Id))
      );
  }, []);

  return (
    <>
      {authInfo() ? (
        <Button
          className={
            "favorite-button " + (active ? "favorite-button-active" : null)
          }
          variant=""
          onClick={() => {
            if (Id) Data.put("Users/favorite/" + authInfo() + "/" + Id);
            setActive(!active);
            //console.log("Button clicked:", authInfo(), Id);
          }}
        >
          <ReactSVG
            src={active ? icons.heartFull : icons.heartEmpty}
            className="favorite-button__fav-icon"
          />
        </Button>
      ) : null}
    </>
  );
}
