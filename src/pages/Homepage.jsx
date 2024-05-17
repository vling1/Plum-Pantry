import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Container, Form, Row } from "react-bootstrap";
import RecipeTile from "./../components/RecipeTile.jsx";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig.jsx";

import logoCircle from "../assets/logo/logo-circle-small.webp";

export default function Homepage() {
  // Returns a list of given size with random, non-repeating recipes
  function getRandomRecipes(dataArray, numberOfRecipes) {
    let list;
    let areUnique = false;
    if (!dataArray || dataArray.length < numberOfRecipes) return [];
    while (!areUnique) {
      areUnique = true;
      list = [];
      // Select random recipes
      for (let i = 0; i < numberOfRecipes; i++) {
        let randomRecipeNumber = Math.floor(Math.random() * dataArray.length);
        list.push(dataArray[randomRecipeNumber]);
      }
      // Check if all ids in the list are unique
      for (let i = 0; i < numberOfRecipes; i++)
        for (let j = i + 1; j < numberOfRecipes; j++)
          if (list[i].recipeId == list[j].recipeId) areUnique = false;
    }
    return list;
  }

  const [recipes, setRecipes] = useState([]);
  // API access
  const getRecipes = async () => {
    try {
      const response = await api.get("/db/Recipes");
      if (response.data && Array.isArray(response.data)) {
        setRecipes(response.data);
        console.log(response.data);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };
  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <PageWrapper>
      <Container fluid="xxl" className="content-section-wrapper">
        <section className="logo-search-section d-flex flex-column align-items-center gap-4 py-4">
          <div className="logo-search-section__img-wrapper overflow-hidden">
            <img src={logoCircle} alt="logo" />
          </div>
          <Form className="d-flex input-group-lg logo-search-section__form pb-3">
            <Form.Control
              type="search"
              placeholder="Find a recipe"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </section>
        <div className="d-flex justify-content-center pb-2">
          <h4>Or try one of these:</h4>
        </div>
        <section className="d-flex recipe-suggestion-section">
          <Container fluid>
            <Row className="row-gap-4 pb-4 justify-content-center">
              {getRandomRecipes(recipes, 4).map((item) => (
                <RecipeTile {...item} key={item.recipeId} />
              ))}
            </Row>
          </Container>
        </section>
      </Container>
    </PageWrapper>
  );
}
