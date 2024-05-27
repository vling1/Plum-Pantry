import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Container } from "react-bootstrap";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import FavoriteButton from "../components/FavoriteButton.jsx";
import icons from "../icon-data.js";
import Tag from "../components/Tag.jsx";
import StarRating from "../components/StarRating.jsx";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig.jsx";
import { timeFormat } from "../components/RecipeTile.jsx";
import StarRatingSelection from "../components/StarRatingSelection.jsx";
import { authInfo } from "../services/authUtils.jsx";

export default function RecipeViewer() {
  /*
    Get parameters from the link
    For example: WEBSITE.COM/?query=tag1+tag2+tag3&sort=favorite
    Will get an object with two parameters: query="tag1 tag2 tag3" and sort="favorite"
  */
  let [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

  let { recipeID } = useParams();
  const [recipe, setRecipe] = useState("");
  const navigate = useNavigate();

  const getRecipe = async () => {
    try {
      const response = await api.get("/db/Recipes/recipe/" + recipeID);
      if (response.data) {
        setRecipe(response.data);
        console.log(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        navigate("/error404");
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      navigate("/error404");
    }
  };

  useEffect(() => {
    // This code happens only once when the page
    // is rendered the first time
    window.scrollTo(0, 0);
    getRecipe();
  }, []);

  return (
    <PageWrapper>
      {/* Recipe Header */}
      <div className="d-flex justify-content-center">
        <Card className="mt-4 mb-4 col-md-10" border="dark">
          <Card.Header>
            <div className="row align-items-center">
              <Card.Body className="col-2" />
              {/* Recipe title */}
              <Card.Body className="col-8">
                <h3 className="text-center p-0 m-0">{recipe.recipeTitle}</h3>
              </Card.Body>
              <Card.Body className="col-2 text-end">
                {recipe.recipeId ? (
                  <FavoriteButton recipeId={recipe.recipeId} />
                ) : null}
              </Card.Body>
            </div>
          </Card.Header>
          <div className="row">
            {/* Recipe author */}
            <Card.Body className="col-4 text-end">
              By {recipe.username}
            </Card.Body>
            {/* Recipe cooking time */}
            <Card.Body className="d-flex gap-2 col-4 justify-content-center">
              <ReactSVG
                src={icons.clock}
                className="recipe-tile__cooking-time-icon"
              />
              {timeFormat(recipe.cookTime)}
            </Card.Body>
            {/* Recipe rating */}
            <Card.Body className="col-4">
              <div className="star-rating__icons d-flex justify-content-start">
                <StarRating rating={recipe.rating} />
              </div>
            </Card.Body>
          </div>
          {/* Recipe image */}
          <Card.Img variant="bottom" src={recipe.image} />
        </Card>
      </div>

      {/* Tag collection */}
      <div className="d-flex justify-content-center">
        <div className="d-flex col-md-10 mb-4 gap-2 flex-wrap">
          {/* Function to test that tags properly wrap*/}
          {recipe.recipeTags?.map((tag) => (
            <Tag icon="none">{tag}</Tag>
          ))}
        </div>
      </div>

      <div className="row d-flex justify-content-center">
        {/* Instructions */}
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Title className="ms-4 mt-4">
              <h4>Instructions</h4>
            </Card.Title>
            <Card.Body>
              <ol>
                {recipe.instructions?.map((instruction) => (
                  <li>{instruction}</li>
                ))}
              </ol>
            </Card.Body>
          </Card>
        </div>

        {/* List of ingredients */}
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Title className="mt-4 text-center">
              <h4>Ingredients</h4>
            </Card.Title>
            <Card.Body>
              {/* Function to test formatting*/}
              {recipe.measDescr?.map((measure) => (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Tag icon="none">{measure.k}</Tag>
                  {measure.v}
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* "Rate this recipe" (only for registered users) */}
      <div className="d-flex justify-content-center">
        <div className="col-md-10 mb-4">
          {authInfo() ? <StarRatingSelection recipeId={recipeID} /> : null}
        </div>
      </div>
    </PageWrapper>
  );
}
