import { Form } from "react-bootstrap";
import { useState } from "react";
import Tag from "./Tag.jsx";

import data from "../data.js";

const maxSuggestionsLength = 10;

export default function TagSelectionWidget({
  tagColor = "blue",
  selectedTagsHook,
}) {
  // Removes a tag by name from the list of selected tags
  function removeTag(tag) {
    setSelectedTags((prevTags) => prevTags.filter((item) => item != tag));
  }

  // Add a tag by name to the list of selected tags
  function addTag(tag) {
    setSelectedTags((prevTags) => {
      if (!prevTags.includes(tag) && data.tags.includes(tag)) {
        return [...prevTags, tag];
      }
      return prevTags;
    });
  }

  // Generates a list of first N tags (N = maxSuggestionsLength) matching the text search
  function generateSuggestionList() {
    // Tag search filtering
    const allTags = data.tags.filter((tag) =>
      tag.toLowerCase().includes(tagSearchInput.toLowerCase())
    );
    if (allTags.length == 0) return "No search results";
    // Tripping the list and generating buttons
    return allTags.splice(0, maxSuggestionsLength).map((tag) => {
      const isSelected = selectedTags.includes(tag);
      if (isSelected) {
        // Tag that is already selected
        return (
          <Tag
            key={tag}
            color={tagColor + "-dim"}
            icon="xMark"
            tagOnClick={() => removeTag(tag)}
          >
            {tag}
          </Tag>
        );
      } else {
        // Tag that is not selected
        return (
          <Tag
            key={tag}
            color={tagColor}
            icon="none"
            tagOnClick={() => addTag(tag)}
          >
            {tag}
          </Tag>
        );
      }
    });
  }

  const [isFocused, setIsFocused] = useState(false);
  const [selectedTags, setSelectedTags] = selectedTagsHook ?? useState([]);
  const [tagSearchInput, setTagSearchInput] = useState("");

  return (
    <div className="position-relative tag-selection-widget">
      {/* Text input */}
      <Form.Control
        placeholder="Add other tags"
        className={
          "form-control tag-selection-widget__input " +
          (isFocused ? "tag-selection-widget__input-active" : null)
        }
        type="text"
        // Fiding/unhiding the dropdown menu
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={tagSearchInput}
        onChange={(event) => setTagSearchInput(event.target.value)}
      />
      {/* Dropdown block */}
      {isFocused ? (
        <div>
          <div className="position-absolute p-3 mt-1 shadow w-100 tag-selection-widget__dropdown z-1 ">
            <div className="d-flex gap-1 flex-wrap">
              {generateSuggestionList()}
            </div>
          </div>
        </div>
      ) : null}
      {/* Selected tags section */}
      {selectedTags.length > 0 ? (
        <div className="d-flex gap-1 flex-wrap pt-2">
          {selectedTags.map((item) => (
            <Tag
              key={item}
              color={tagColor}
              icon="xMark"
              tagOnClick={() => removeTag(item)}
            >
              {item}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}
