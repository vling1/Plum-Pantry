import PageWrapper from "./../components/PageWrapper.jsx";
import { Col, Container, Row, Pagination } from "react-bootstrap";
import RecipeTile from "../components/RecipeTile.jsx";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Data from "../services/Data.jsx";
import { useState, useEffect } from "react";
import { isLoggedIn, authInfo } from "../services/authUtils.jsx";

import icons from "./../icon-data.js";

const maxItemsOnPage = 24;
let pageMax;

let username;

// Returns the number of pages that are needed to display given data
function getPageMaxNumber(dataArray) {
  if (!dataArray) return 1;

  let count = 0;
  dataArray.forEach((item) => {
    if (item.username == username) {
      count++;
    }
  });

  return Math.max(1, Math.ceil(count / maxItemsOnPage));
}

// This function takes all data from the query and returns
// a subarray of data to display it on the given page
function getPageData(dataArray, pageNumber) {
  console.log("dataArray", dataArray);
  if (!dataArray) return [];

  let arr = [];
  dataArray.forEach((item) => {
    if (item.username == username) {
      arr.push(item);
    }
  });

  if (arr.length <= maxItemsOnPage) return arr;
  else {
    if (pageNumber > pageMax) {
      pageNumber = pageMax;
    }
    const startPos = (pageNumber - 1) * maxItemsOnPage;
    return arr.slice(startPos, startPos + maxItemsOnPage);
  }
}

export default function Recipes() {
  const navigate = useNavigate();

  // Generating a page button for a given page number or special value
  function generatePageButton(buttonText, key) {
    console.log("page", page);
    // Disabled pages: 1) "..." 2) next when there's no next 3) prev when there's no prev
    if (
      buttonText == "..." ||
      ((buttonText == "‹" || buttonText == "«") && page == 1) ||
      ((buttonText == "›" || buttonText == "»") && page == pageMax)
    )
      return (
        <Pagination.Item disabled key={key}>
          {buttonText}
        </Pagination.Item>
      );
    // Active page
    if (buttonText == page)
      return (
        <Pagination.Item key={key} active>
          {buttonText}
        </Pagination.Item>
      );
    // Control buttons
    let newParams = new URLSearchParams(searchParams);
    if (buttonText == "‹") newParams.set("page", page - 1);
    else if (buttonText == "›") newParams.set("page", page + 1);
    else if (buttonText == "«") newParams.set("page", 1);
    else if (buttonText == "»") newParams.set("page", pageMax);
    else newParams.set("page", buttonText);

    return (
      <Pagination.Item
        key={key}
        onClick={() => navigate("/myrecipes?" + newParams.toString())}
      >
        {buttonText}
      </Pagination.Item>
    );
  }

  // Returns a list of buttons for the Pagination component
  function genearatePagination() {
    let buttonList = [];
    // "Previous" and "first" buttons
    buttonList.push("«");
    buttonList.push("‹");
    if (pageMax <= 5) {
      // Small number of pages; no pagination reductions
      for (let i = 1; i <= pageMax; i++) buttonList.push(i);
    } else {
      // Large number of pages; pagination reductions with "..."
      if (page > 3) {
        // [1] [...] [10] [11] [ACTIVE]
        buttonList.push(1);
        buttonList.push("...");
        for (let i = page - 2; i < page; i++) buttonList.push(i);
      } else {
        // [1] [2] [ACTIVE]
        for (let i = 1; i < page; i++) buttonList.push(i);
      }
      if (pageMax - page >= 3) {
        // [ACTIVE] [13] [14] [...] [99]
        for (let i = page; i <= page + 2; i++) buttonList.push(i);
        buttonList.push("...");
        buttonList.push(pageMax);
      } else {
        // [ACTIVE] [4] [5]
        for (let i = page; i <= getPageMaxNumber(recipes); i++)
          buttonList.push(i);
      }
    }
    // "Next" and "last" buttons
    buttonList.push("›");
    buttonList.push("»");
    // Generating actual buttons from the list
    return buttonList.map((item, index) => generatePageButton(item, index));
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/error404");
    } else {
      username = authInfo();
    }

    Data.get("Recipes").then((response) =>
      setRecipes(
        Data.sortRecipes(response, searchParams.get("sort"), searchQuery)
      )
    );
  }, [searchQuery]);

  pageMax = getPageMaxNumber(recipes);

  // ================ READING PARAMS FROM THE URL ================

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

  // =============================================================

  return (
    <PageWrapper
      showSearchBar="false"
      showGlobalRecipeSearch="false"
      searchQueryHook={() => [searchQuery, setSearchQuery]}
    >
      {/* =========== Recipe tiles =========== */}
      <section className="d-flex mb-4 recipe-suggestion-section">
        <Container fluid>
          <Row className="row-gap-4 pb-4">
            <Col className="col-lg-3 col-12">
              <Link className="no-style-link" to="/editor">
                <div
                  className="h-100 bg-body-secondary d-flex justify-content-center align-items-center"
                  style={{ border: "dashed" }}
                >
                  <img src={icons.plus} width={75} height={75} />
                </div>
              </Link>
            </Col>
            {getPageData(recipes, page).map((item) =>
              item.username == username ? (
                <RecipeTile {...item} key={item.recipeId} />
              ) : (
                <></>
              )
            )}
          </Row>
        </Container>
      </section>

      {/* =========== Pagination =========== */}
      <div className="d-flex ps-3 pe-3 pb-4 pagination-container justify-content-center">
        <Pagination>{genearatePagination()}</Pagination>
      </div>
    </PageWrapper>
  );
}
