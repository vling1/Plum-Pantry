import axios from "axios";
import { authInfo } from "./authUtils";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export default class Data {
  // Fetching data
  static async get(request) {
    try {
      const response = await api.get("/db/" + request);
      // Fetching succeeded
      if (response.data) return response.data;
      // Fetching failed
      else console.error("Error: fetching failed", request, response);
    } catch (err) {
      console.error("Unexpected error: fetching failed", request, err);
    }
    return null;
  }

  // Sending data
  static async set(request, data) {
    try {
      const response = await api.post("/db/" + request, data);
      // Posting succeeded
      if (response) return response;
      // Posting failed
      else console.error("Error: posting failed", request, response);
    } catch (err) {
      console.error("Unexpected error: posting failed", request, err);
    }
    return null;
  }

  // Sorting recipe data
  static sortRecipes({
    recipes,
    sortMode = null,
    query = null,
    tags = null,
    username = null,
  }) {
    console.log("RECIPES DATA:", recipes);
    console.log("sortmode:", sortMode);
    console.log("Sorting by query: ", query);
    // Setting default value ("alphabetical") in case
    // any non-valid value is found
    if (
      sortMode != "alphabetical" &&
      sortMode != "rating" &&
      sortMode != "favorite"
    )
      sortMode = "alphabetical";
    console.log("Sort mode:", sortMode);

    // sort mode application
    switch (sortMode) {
      case "alphabetical":
        recipes.sort((a, b) => {
          const aT = a.recipeTitle;
          const bT = b.recipeTitle;
          return aT.localeCompare(bT);
        });
        break;
      case "rating":
        recipes.sort((a, b) => b.rating - a.rating);
        break;
      case "favorite":
        break;
    }
    // user filtering
    if (username) {
      recipes = recipes.filter((item) => item.username === username);
    }
    // privacy filtering
    const currentUser = authInfo() || "";
    recipes = recipes.filter(
      (item) => item.isPublic || item.username === currentUser
    );
    // text query filtering
    if (query) {
      query = query.trim().toLowerCase();
      recipes = recipes.filter((item) =>
        item.recipeTitle.toLowerCase().includes(query)
      );
    }
    // tag query filtering
    if (tags) {
      recipes = recipes.filter((item) => {
        let matchingTags = 0;
        tags.forEach((tag) => {
          if (tag.category == "Ingredients")
            if (
              item.ingredients.find(
                (item) => item.toLowerCase() == tag.name.toLowerCase()
              )
            )
              matchingTags++;
          if (tag.category == "Tags")
            if (
              item.recipeTags.find(
                (item) => item.toLowerCase() == tag.name.toLowerCase()
              )
            )
              matchingTags++;
        });
        console.log("Matching", matchingTags);
        // If all tags were found, we that's a matching recipe
        return matchingTags === tags.length;
      });
    }
    return recipes;
  }
}
