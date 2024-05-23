import PageWrapper from "./../components/PageWrapper.jsx";
import { Container, Row } from "react-bootstrap";
import RecipeTile from "../components/RecipeTile.jsx";
import { useSearchParams, Link, json, useNavigate } from "react-router-dom";
import Data from "../services/Data.jsx";
import { useEffect, useState } from "react";
import RecipePagination from "../components/RecipePagination.jsx";

const maxItemsOnPage = 24;
let pageMax;

// Returns the number of pages that are needed to display given data
function getPageMaxNumber(dataArray) {
  if (!dataArray) return 1;
  return Math.max(1, Math.ceil(dataArray.length / maxItemsOnPage));
}

// This function takes all data from the query and returns
// a subarray of data to display it on the given page
function getPageData(dataArray, pageNumber) {
  console.log("dataArray", dataArray);
  if (!dataArray) return [];
  if (dataArray.length <= maxItemsOnPage) return dataArray;
  else {
    if (pageNumber > pageMax) {
      pageNumber = pageMax;
    }
    const startPos = (pageNumber - 1) * maxItemsOnPage;
    return dataArray.slice(startPos, startPos + maxItemsOnPage);
  }
}

// type:
// "public" for the regular recipe display
// "private" for current user's recipies
export default function Recipes({ type }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [sortMode, setSortMode] = useState("alphabetical");
  const [tagQuery, setTagQuery] = useState([]);

  // ======== FILTERING RECIPES FOR DISPLAY ========
  useEffect(() => {
    if (searchQuery === null) return; // Prevents racing condition
    Data.get("Recipes").then((response) =>
      setRecipes(Data.sortRecipes(response, sortMode, searchQuery, tagQuery))
    );
    console.log("searchQuery", searchQuery);
    console.log("tagQuery", tagQuery);
  }, [searchQuery, sortMode, tagQuery]);

  pageMax = getPageMaxNumber(recipes);

  // Page parameter must be integer (page=1 otherwise)
  let page = parseInt(searchParams.get("page"));
  if (isNaN(page)) {
    page = 1;
  }
  // Page parameter must be not greater then pageMax (page=pageMax otherwise)
  else if (page > pageMax) {
    page = pageMax;
  }
  // Page parameter must be not lesser then 1 (page=1 otherwise)
  else if (page < 1) {
    page = 1;
  }

  return (
    <PageWrapper
      showSearchBar="false"
      showGlobalRecipeSearch="true"
      searchQueryHook={() => [searchQuery, setSearchQuery]}
      tagQueryHook={() => [tagQuery, setTagQuery]}
      sortModeHook={() => [sortMode, setSortMode]}
    >
      {/* =========== Recipe tiles =========== */}
      <section className="d-flex mb-4 recipe-suggestion-section">
        <Container fluid>
          <Row className="row-gap-4 pb-4">
            {/* Never displaying tiles unless the search query is defined;
            this prevents tiles from flickering as the searchQuery gets defined */}
            {searchQuery !== null
              ? getPageData(recipes, page).map((item) => (
                  <RecipeTile {...item} key={item.recipeId} />
                ))
              : null}
          </Row>
        </Container>
      </section>

      {/* =========== Pagination =========== */}
      <div className="d-flex ps-3 pe-3 pb-4 pagination-container justify-content-center">
        <RecipePagination
          page={page}
          pageMax={pageMax}
          searchParams={searchParams}
        />
      </div>
    </PageWrapper>
  );
}
