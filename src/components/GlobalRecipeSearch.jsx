import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import Tag from "./../components/Tag.jsx";
import icons from "./../icon-data.js";
import Data from "../services/Data.jsx";

// If lesser number of tags appear in a category, we merge it with other categories
const categoryMinTags = 20;

export default function GlobalRecipeSearch({
  searchQueryHook = null,
  sortModeHook = null,
  tagQueryHook = null,
}) {
  // Removes a tag by ID from the list of selected tags
  function removeTag(tagID) {
    setSelectedTags((prevTags) => prevTags.filter((item) => item.id != tagID));
  }

  // Add a tag by name to the list of selected tags
  function addTag(tagID) {
    setSelectedTags((prevTags) => {
      if (
        prevTags.every((item) => item.id != tagID) &&
        allTags.some((item) => item.id == tagID)
      ) {
        const addedTag = allTags.find((item) => item.id == tagID);
        return [...prevTags, addedTag];
      }
      return prevTags;
    });
  }

  // Separates tags into a list of categories. Each block is it the form of: {name: "Block Name", tags: ["tag1", "tag2", "tag3"]}
  function separateTagCategories() {
    // Tag search filtering
    let filteredTags = allTags.filter((item) =>
      item.name.toLowerCase().includes(tagSearchInput.toLowerCase())
    );
    // Sorting tags
    if (filteredTags) {
      filteredTags.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (filteredTags.length <= categoryMinTags)
      // No categories if the number of tags is small
      return [
        {
          name: "",
          tags: [...filteredTags],
        },
      ];
    switch (tagSort) {
      case "alphabetical":
        let arraysByLetter = new Map();
        for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++)
          arraysByLetter[String.fromCharCode(i)] = [];
        // Separating tags into associated first-letter arrays
        filteredTags.map((item) => {
          if (item.name !== "") {
            const firstLetter = item.name[0].toLowerCase();
            arraysByLetter[firstLetter].push(item);
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
              tags: [...accTags],
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
        return [
          {
            name: "Tags",
            tags: [...filteredTags.filter((item) => item.category == "Tags")],
          },
          {
            name: "Ingredients",
            tags: [
              ...filteredTags.filter((item) => item.category == "Ingredients"),
            ],
          },
        ];
      // All tags in a pile
      default:
        return [
          {
            name: "All tags",
            tags: [...filteredTags],
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
                key={item.id}
                icon={selectedTagIcon}
                color={selectedTagColor}
                tagOnClick={() => {
                  removeTag(item.id);
                }}
              >
                {item.name}
              </Tag>
            ) : (
              <Tag
                key={item.id}
                icon="none"
                color="blue"
                tagOnClick={() => {
                  addTag(item.id);
                }}
              >
                {item.name}
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

    let newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", textSearchInput);
    newSearchParams.set("page", 1);
    newSearchParams.set(
      "tags",
      selectedTags.map((item) =>
        encodeURIComponent(
          JSON.stringify({
            // Tag
            n: item.name,
            // Category
            c: item.category,
          })
        )
      ) // Serializing
    );
    if (advancedSearchToggle) newSearchParams.set("advancedMode", "true");
    if (whatsInTheFridgeToggle) newSearchParams.set("fridgeMode", "true");
    if (mainSort) newSearchParams.set("sort", mainSort);
    // Passing tag query to the recipe listing page
    if (tagQueryHook) {
      const [tagQuery, setTagQuery] = tagQueryHook();
      setTagQuery(selectedTags);
    }
    // Passing search query to the recipe listing page
    if (searchQueryHook) {
      const [searchQuery, setSearchQuery] = searchQueryHook();
      setSearchQuery(textSearchInput);
      navigate("/recipes?" + newSearchParams.toString());
    }
  }
  const navigate = useNavigate();

  const [advancedSearchToggle, setAdvancedSearchToggle] = useState(false);
  const [whatsInTheFridgeToggle, setWhatsInTheFridgeToggle] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mainSort, setMainSort] = sortModeHook
    ? sortModeHook()
    : useState("alphabetical");
  const [tagSort, setTagSort] = useState("alphabetical");
  const [tagSearchInput, setTagSearchInput] = useState("");
  const [textSearchInput, setTextSearchInput] = useState("");
  // allTags contain objects of type: {name: "NAME", category: "CATEGORY"}
  const [allTags, setAllTags] = useState([]);

  const selectedTagColor = whatsInTheFridgeToggle ? "yellow" : "green";
  const selectedTagIcon = whatsInTheFridgeToggle ? "question" : "check";

  const [searchParams, setSearchParams] = useSearchParams();

  //Fetching tags and ingredients then merging them into allTags
  let areTagsFetched = false;
  useEffect(() => {
    if (!areTagsFetched) {
      Data.get("Ingredients").then((response) => {
        const addedData = response
          .map((item) => ({
            id: item.ingID,
            name: item.ingName,
            category: "Ingredients",
          }))
          .filter((item) => item.name != null);
        setAllTags((prevTags) => [...prevTags, ...addedData]);
      });
      Data.get("Tags").then((response) => {
        const addedData = response
          .map((item) => ({
            id: item.tagID,
            name: item.tagName,
            category: "Tags",
          }))
          .filter((item) => item.name != null);
        setAllTags((prevTags) => [...prevTags, ...addedData]);
      });
    }
    areTagsFetched = true;
  }, []);

  //Pre-selecting tags and inputting the text search query in the form
  useEffect(() => {
    if (searchParams.get("tags"))
      searchParams
        .get("tags")
        .split(",")
        .forEach((tag) => {
          // Deserializing
          const tagJson = JSON.parse(decodeURIComponent(tag));
          // Name
          const n = tagJson?.n;
          // Category
          const c = tagJson?.c;
          const newTag = allTags.find(
            (item) => item.name === tagJson.n && item.category === tagJson.c
          );
          // Adding tag if we found it
          if (newTag) addTag(newTag.id);
        });
    const [searchQuery, setSearchQuery] = searchQueryHook();
    let query = searchParams.get("search");
    if (query === null) query = "";
    setTextSearchInput(query);
    // Sending freshly updated search query to the recipe listing page
    setSearchQuery(query);
    if (searchParams.get("advancedMode") == "true")
      setAdvancedSearchToggle(true);
    if (searchParams.get("fridgeMode") == "true")
      setWhatsInTheFridgeToggle(true);
    const sortType = searchParams.get("sort");
    if (
      sortType == "alphabetical" ||
      sortType == "favorite" ||
      sortType == "rating"
    )
      setMainSort(sortType);
    else setMainSort("alphabetical");
  }, [allTags]);

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
            <Button onClick={() => setMainSort("alphabetical")}>A-Z</Button>
            <Button
              className="icon-button"
              onClick={() => setMainSort("rating")}
            >
              <ReactSVG src={icons.starFull} />
            </Button>
            <Button
              className="icon-button"
              onClick={() => setMainSort("favorite")}
            >
              <ReactSVG src={icons.heartFull} />
            </Button>
          </div>
          {/* Selected tags section */}
          {advancedSearchToggle && selectedTags.length > 0 ? (
            <div className="d-flex gap-1 flex-wrap pt-2">
              {selectedTags.map((item) => (
                <Tag
                  key={item.id}
                  color={selectedTagColor}
                  tagOnClick={() => removeTag(item.id)}
                >
                  {item.name}
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
              <Button onClick={() => setTagSort("alphabetical")}>A-Z</Button>
              <Button
                className="icon-button"
                onClick={() => setTagSort("categories")}
              >
                Category
              </Button>
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
