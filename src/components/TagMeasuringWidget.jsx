import { Form } from "react-bootstrap";
import { useState } from "react";
import Tag from "./Tag.jsx";

import data from "../data.js";

const maxSuggestionsLength = 10;

export default function TagMeasuringWidget({
  tagColor = "blue",
  selectedIngredientsHook,
  ingredientIsEmpty
}) {
  // Removes an ingredients by name from the list of selected ingredients
  function removeIngredient(tag) {
    setSelectedIngredients((prevIngr) =>
      prevIngr.filter((ingr) => ingr.tag != tag)
    );
  }

  // Add an ingredients by name to the list of selected ingredients
  function addIngredient(tag) {
    setSelectedIngredients((prevIngr) => {
      if (
        prevIngr.filter((ingr) => ingr.tag == tag).length == 0 &&
        data.tags.includes(tag)
      ) {
        // Adding an ingedient object
        let newIngr = {
          tag: tag,
          measure: "",
        };
        return [...prevIngr, newIngr];
      }
      return prevIngr;
    });
  }

  // Set values for a selected an ingredient
  function updateIngredient({ tag, measure }) {
    setSelectedIngredients((prevIngr) =>
      prevIngr.map((ingr) => {
        // Matching tag to be edited
        if (ingr.tag == tag) {
          ingr.measure = measure;
        }
        return ingr;
      })
    );
  }

  // Generates a list of first N tags (N = maxSuggestionsLength) matching the text search
  function generateSuggestionList() {
    // Tag search filtering
    const allTags = data.tags
      // The tag exists
      .filter((tag) => tag.toLowerCase().includes(tagSearchInput.toLowerCase()))
      // AND it's not selected yet
      .filter(
        (tag) =>
          selectedIngredients.filter((ingr) => ingr.tag == tag).length == 0
      );
    if (allTags.length == 0) return "No search results";
    // Tripping the list and generating buttons
    return allTags.splice(0, maxSuggestionsLength).map((tag) => {
      const isSelected = selectedIngredients.includes(tag);
      if (isSelected) {
        // Tag that is already selected
        return (
          <Tag
            color={tagColor + "-dim"}
            icon="xMark"
            tagOnClick={() => removeIngredient(tag)}
          >
            {tag}
          </Tag>
        );
      } else {
        // Tag that is not selected
        return (
          <Tag
            color={tagColor}
            icon="none"
            tagOnClick={() => addIngredient(tag)}
          >
            {tag}
          </Tag>
        );
      }
    });
  }

  const [isFocused, setIsFocused] = useState(false);
  const [selectedIngredients, setSelectedIngredients] =
    selectedIngredientsHook != null ? selectedIngredientsHook() : useState([]);
  const [tagSearchInput, setTagSearchInput] = useState("");

  return (
    <div className="position-relative tag-measuring-widget">
      {/* Text input */}
      <Form.Control
        placeholder="Add ingredients"
        className={
          "form-control tag-measuring-widget__input " +
          (isFocused ? "tag-measuring-widget__input-active" : null)
        }
        type="text"
        // Fiding/unhiding the dropdown menu
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={tagSearchInput}
        onChange={(event) => setTagSearchInput(event.target.value)}
        isInvalid={ingredientIsEmpty}
      />
      {/* Dropdown block */}
      {isFocused ? (
        <div>
          <div className="position-absolute p-3 mt-1 shadow w-100 tag-measuring-widget__dropdown z-1">
            <div className="d-flex gap-1 flex-wrap">
              {generateSuggestionList()}
            </div>
          </div>
        </div>
      ) : null}
      {/* Selected ingredients section */}
      {selectedIngredients.length > 0 ? (
        <div className="d-flex flex-column gap-1 pt-2">
          {selectedIngredients.map((ingr) => (
            <div
              className="d-flex flex-row tag-measuring-widget__row gap-1"
              key={ingr.tag}
            >
              {/* Ingredient tag */}
              <Tag
                key={ingr.tag}
                color={tagColor}
                icon="xMark"
                className="w-100"
                iconOnClick={() => removeIngredient(ingr.tag)}
              >
                {ingr.tag}
              </Tag>
              {/* Measure input */}
              <Form.Control
                type="text"
                maxlength="10"
                className="tag-measuring-widget__measure"
                placeholder="1 piece"
                value={ingr.measure}
                onChange={(event) => {
                  // Updating ingredient's measure
                  const measure = event.target.value;
                  updateIngredient({ tag: ingr.tag, measure: measure });
                }}
                isInvalid={ingr.measure == ""}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
