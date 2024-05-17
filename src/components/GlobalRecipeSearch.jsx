import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import Tag from "./../components/Tag.jsx";
import icons from "./../icon-data.js";

import data from "../data.js";

// If lesser number of tags appear in a category, we merge it with other categories
const categoryMinTags = 20;

export default function GlobalRecipeSearch() {
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

  // Separates tags into a list of categories. Each block is it the form of: {name: "Block Name", tags: ["tag1", "tag2", "tag3"]}
  function separateTagCategories() {
    // Tag search filtering
    let allTags = data.tags.filter((tag) =>
      tag.toLowerCase().includes(tagSearchInput.toLowerCase())
    );
    // No categories if the number of tags is small
    if (allTags.length <= categoryMinTags)
      return [
        {
          name: "",
          tags: [...allTags],
        },
      ];
    switch (tagSort) {
      case "alphabetical":
        let arraysByLetter = new Map();
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++)
          arraysByLetter[String.fromCharCode(i)] = [];
        // Separating tags into associated first-letter arrays
        allTags.map((tag) => {
          if (tag !== "") {
            const firstLetter = tag[0].toLowerCase();
            arraysByLetter[firstLetter].push(tag);
          }
        });
        let listOfBlocks = [];
        let startLetter = null;
        let startLetterSaved;
        let accTags = [];
        let categoryName;
        let curLetter;
        // Greedy union of categories
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          curLetter = String.fromCharCode(i);
          if (arraysByLetter[curLetter].length == 0) continue;
          if (!startLetter) startLetter = curLetter;
          accTags = [...accTags, ...arraysByLetter[curLetter]];
          if (accTags.length >= categoryMinTags) {
            // One-letter cathegory ("A")
            if (startLetter == curLetter) categoryName = curLetter;
            // Two-letter cathegory ("A — Z")
            else categoryName = startLetter + " — " + curLetter;
            // Adding a category to the list
            listOfBlocks.push({
              name: categoryName.toUpperCase(),
              tags: accTags,
            });
            // Resetting for the next category
            accTags = [];
            startLetterSaved = startLetter;
            startLetter = null;
          }
        }
        // Finding the last non-empty letter-array
        let endLetter;
        startLetter = startLetterSaved;
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          if (arraysByLetter[String.fromCharCode(i)].length != 0)
            endLetter = String.fromCharCode(i);
        }
        // One-letter cathegory ("A")
        if (startLetter == endLetter) categoryName = endLetter;
        // Two-letter cathegory ("A — Z")
        else categoryName = startLetter + " — " + endLetter;
        // Extending the last element of the array
        let lastBlock = listOfBlocks[listOfBlocks.length - 1];
        listOfBlocks[listOfBlocks.length - 1] = {
          name: categoryName.toUpperCase(),
          tags: [...lastBlock.tags, ...accTags],
        };
        return listOfBlocks;
      case "categories":
      // All tags in a pile
      default:
        return [
          {
            name: "All tags",
            tags: [...allTags],
          },
        ];
    }
  }

  // Generate tag categories from an array. Each block is it the form of: {name: "Block Name", tags: ["tag1", "tag2", "tag3"]}
  function generateTagCategories() {
    const blockList = separateTagCategories();
    return blockList.map((block) => (
      <>
        <h3 className="m-0">{block.name}</h3>
        <div className="d-flex flex-wrap gap-1">
          {block.tags.map((item) =>
            selectedTags.includes(item) ? (
              <Tag
                key={item}
                icon={selectedTagIcon}
                color={selectedTagColor}
                tagOnClick={() => {
                  removeTag(item);
                }}
              >
                {item}
              </Tag>
            ) : (
              <Tag
                key={item}
                icon="none"
                color="blue"
                tagOnClick={() => {
                  addTag(item);
                }}
              >
                {item}
              </Tag>
            )
          )}
        </div>
      </>
    ));
  }

  // This function is redirecting to a recipe listing page with a new search query in the URL
  function handleSearchSubmit(event) {
    event.preventDefault();

    let newSearchParams = searchParams;
    newSearchParams.set("search", textSearchInput);
    newSearchParams.set(
      "tags",
      selectedTags.map((item) => encodeURIComponent(item)) // Serializing
    );
    if (advancedSearchToggle) newSearchParams.set("advancedMode", "true");
    if (whatsInTheFridgeToggle) newSearchParams.set("fridgeMode", "true");

    navigate("/recipes?" + newSearchParams.toString());
  }
  const navigate = useNavigate();

  const [advancedSearchToggle, setAdvancedSearchToggle] = useState(false);
  const [whatsInTheFridgeToggle, setWhatsInTheFridgeToggle] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mainSort, setMainSort] = useState("alphabetical");
  const [tagSort, setTagSort] = useState("alphabetical");
  const [tagSearchInput, setTagSearchInput] = useState("");
  const [textSearchInput, setTextSearchInput] = useState("");

  const selectedTagColor = whatsInTheFridgeToggle ? "yellow" : "green";
  const selectedTagIcon = whatsInTheFridgeToggle ? "question" : "check";

  const [searchParams, setSearchParams] = useSearchParams();

  //Pre-selecting tags and inputting the text search query in the form
  useEffect(() => {
    if (searchParams.get("tags"))
      searchParams
        .get("tags")
        .split(",")
        .forEach((tag) => addTag(decodeURIComponent(tag))); // Deserializing
    setTextSearchInput(searchParams.get("search") ?? "");
    if (searchParams.get("advancedMode") == "true")
      setAdvancedSearchToggle(true);
    if (searchParams.get("fridgeMode") == "true")
      setWhatsInTheFridgeToggle(true);
  }, []);

  return (
    <section className="d-flex global-recipe-search flex-column">
      {/* ========== Search bar section ========== */}
      <section className="d-flex align-items-end justify-content-between w-100 text-nowrap px-3 px-lg-4 py-2">
        <Button
          onClick={() => {
            if (advancedSearchToggle)
              setWhatsInTheFridgeToggle(!whatsInTheFridgeToggle);
            else {
              setWhatsInTheFridgeToggle(true);
              setAdvancedSearchToggle(true);
            }
          }}
        >
          What's in the fridge?
        </Button>
        <div className="d-flex flex-column flex-shrink-1 px-3">
          <div className="d-flex gap-1 justify-content-center">
            {/* Main search bar */}
            <Form
              onSubmit={handleSearchSubmit}
              className="d-flex input-group logo-search-section__form flex-shrink-1"
            >
              <Form.Control
                type="search"
                placeholder="Find a recipe"
                className="me-2"
                aria-label="Search"
                value={textSearchInput}
                onChange={(event) => setTextSearchInput(event.target.value)}
              />
              <Button variant="outline-success" type="submit">
                Search
              </Button>
            </Form>
            <Button>A-Z</Button>
            <Button className="icon-button">
              <ReactSVG src={icons.starFull} />
            </Button>
            <Button className="icon-button">
              <ReactSVG src={icons.heartFull} />
            </Button>
          </div>
          {/* Selected tags section */}
          {advancedSearchToggle && selectedTags.length > 0 ? (
            <div className="d-flex gap-1 flex-wrap pt-2">
              {selectedTags.map((item) => (
                <Tag
                  key={item}
                  color={selectedTagColor}
                  tagOnClick={() => removeTag(item)}
                >
                  {item}
                </Tag>
              ))}
            </div>
          ) : null}
        </div>
        <Button
          className="text-nowrap"
          onClick={() => {
            setAdvancedSearchToggle(!advancedSearchToggle);
          }}
        >
          Advanced search
        </Button>
      </section>
      {/* ========== Advanced section ========== */}
      {advancedSearchToggle ? (
        <section className="global-recipe-search__advanced-search px-4 pb-4">
          <div className="d-flex gap-1 flex-column flex-wrap pt-2">
            <div className="d-flex gap-1 justify-content-center pb-1">
              {/* Tag search bar */}
              <Form className="d-flex input-group logo-search-section__form flex-shrink-1">
                <Form.Control
                  type="search"
                  placeholder="Find a tag"
                  className="me-2"
                  aria-label="Search"
                  value={tagSearchInput}
                  onChange={(event) => setTagSearchInput(event.target.value)}
                />
              </Form>
              <Button>A-Z</Button>
              <Button className="icon-button">Category</Button>
            </div>
            <div className="d-flex flex-column flex-wrap gap-2">
              {generateTagCategories()}
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
