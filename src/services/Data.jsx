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

  // Posting data
  static async post(request, data = null) {
    try {
      let response;
      if (data) response = await api.post("/db/" + request, data);
      else response = await api.post("/db/" + request);
      // Posting succeeded
      if (response) return response;
      // Posting failed
      else console.error("Error: posting failed", request, response);
    } catch (err) {
      console.error("Unexpected error: posting failed", request, err);
    }
    return null;
  }

  // Putting data
  static async put(request, data = null) {
    try {
      let response = null;
      if (data) response = await api.put("/db/" + request, data);
      else response = await api.put("/db/" + request);
      // Put succeeded
      if (response) return response;
      // Put failed
      else console.error("Error: put failed", request, response);
    } catch (err) {
      console.error("Unexpected error: put failed", request, err);
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
    favorite = null,
    fridgeMode = false,
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

    // User filtering
    if (username) {
      recipes = recipes.filter((item) => item.username === username);
    }
    // Privacy filtering
    const currentUser = authInfo() || "";
    recipes = recipes.filter(
      (item) => item.isPublic || item.username === currentUser
    );
    // Text query filtering
    if (query) {
      query = query.trim().toLowerCase();
      recipes = recipes.filter((item) =>
        item.recipeTitle.toLowerCase().includes(query)
      );
    }

    // Fridge mode application
    if (fridgeMode) {
      // We don't to apply sorting in "What's in the fridge?" mode
      recipes.map((item) => {
        // Match rate is 0% if there are no tags
        if (!tags) {
          item.matchRate = 0;
          return item;
        } else {
          // If there's are tags, count matches
          let counter = 0;
          // Merging tags and ingredients
          let itemTags = [];
          if (item.recipeTags) {
            itemTags = [
              ...itemTags,
              ...item.recipeTags.map((item) => ({
                name: item,
                category: "Tags",
              })),
            ];
          }
          if (item.ingredients) {
            itemTags = [
              ...itemTags,
              ...item.ingredients.map((item) => ({
                name: item,
                category: "Ingredients",
              })),
            ];
          }

          itemTags?.forEach((item) => {
            // Checking the tag query for matches
            tags.forEach((tag) => {
              /*console.log(
                "COMPARING:",
                item.name,
                item.category,
                tag.name,
                tag.category
              );*/
              if (
                item.name.toLowerCase() == tag.name.toLowerCase() &&
                item.category == tag.category
              ) {
                // Match found
                counter++;
              }
            });
          });
          console.log("counter", counter);
          if (counter == 0) item.matchRate = 0;
          else item.matchRate = Math.ceil((100 * counter) / tags.length);
          console.log("item.matchRate", item.matchRate);
          return item;
        }
      });
      // Filtering 0% matches
      recipes = recipes.filter((item) => item.matchRate != 0);
      // Sorting by the match rate
      recipes.sort((a, b) => a.matchRate < b.matchRate);
      // No further filtering is applied
      return recipes;
    }

    // Tag query filtering
    if (tags) {
      recipes = recipes.filter((item) => {
        let matchingTags = 0;
        tags.forEach((tag) => {
          if (tag.category == "Ingredients")
            if (
              item?.ingredients.find(
                (item) => item.toLowerCase() == tag.name.toLowerCase()
              )
            )
              matchingTags++;
          if (tag.category == "Tags")
            if (
              item?.recipeTags.find(
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
        let fav = [];
        let nonFav = [];
        recipes.forEach((item) => {
          if (favorite.includes(item.recipeId)) fav.push(item);
          else nonFav.push(item);
        });
        console.log("favorite", favorite);
        fav.sort((a, b) => {
          const aT = a.recipeTitle;
          const bT = b.recipeTitle;
          return aT.localeCompare(bT);
        });
        nonFav.sort((a, b) => {
          const aT = a.recipeTitle;
          const bT = b.recipeTitle;
          return aT.localeCompare(bT);
        });
        recipes = fav.concat(nonFav);
        break;
    }
    return recipes;
  }
}
