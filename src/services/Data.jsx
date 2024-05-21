import axios from "axios";
import { useSearchParams } from "react-router-dom";

const api = axios.create({
  baseURL: "http://plum-pantry.us-east-2.elasticbeanstalk.com",
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
  static sortRecipes(recipes, sortMode = null, query = null) {
    console.log("RECIPES DATA:", recipes);
    console.log("sortmode:", sortMode);
    // Setting default value ("alphabetical") in case
    // any non-valid value is found
    if (
      sortMode != "alphabetical" &&
      sortMode != "rating" &&
      sortMode != "favorite"
    )
      sortMode = "alphabetical";
    console.log("Sort mode:", sortMode);

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
    if (!query) return recipes;
    else {
      query = query.trim().toLowerCase();
      recipes = recipes.filter((item) =>
        item.recipeTitle.toLowerCase().includes(query)
      );
    }
    return recipes;
  }
}
