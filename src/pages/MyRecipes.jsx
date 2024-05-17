import PageWrapper from "./../components/PageWrapper.jsx";
import { Col, Container, Row, Pagination } from "react-bootstrap";
import RecipeTile from "../components/RecipeTile.jsx";
import { useSearchParams, Link } from "react-router-dom";

import data from "../data.js";
import icons from "./../icon-data.js";

const maxItemsOnPage = 24;
const pageMax = getPageMaxNumber(data.recipies);

// Returns the number of pages that are needed to display given data
function getPageMaxNumber(dataArray) {
  return Math.max(1, Math.ceil(dataArray.length / maxItemsOnPage));
}

// This function takes all data from the query and returns
// a subarray of data to display it on the given page
function getPageData(dataArray, pageNumber) {
  if (dataArray.length <= maxItemsOnPage) return dataArray;
  else {
    if (pageNumber > pageMax) {
      pageNumber = pageMax;
    }
    const startPos = (pageNumber - 1) * maxItemsOnPage;
    console.log(
      "Displayed items: from",
      startPos,
      "to",
      startPos + maxItemsOnPage
    );
    return dataArray.slice(startPos, startPos + maxItemsOnPage);
  }
}

export default function Recipes() {
  let page = 1;
  let [searchParams, setSearchParams] = useSearchParams();

  // Generating a page button for a given page number or special value
  function generatePageButton(buttonText) {
    console.log("page", page);
    // Disabled pages: 1) "..." 2) next when there's no next 3) prev when there's no prev
    if (
      buttonText == "..." ||
      ((buttonText == "‹" || buttonText == "«") && page == 1) ||
      ((buttonText == "›" || buttonText == "»") && page == pageMax)
    )
      return <Pagination.Item disabled>{buttonText}</Pagination.Item>;
    // Active page
    if (buttonText == page)
      return (
        <Pagination.Item active>
          <Link
            to={"/myrecipes?" + searchParams.toString()}
            className="no-style-link"
          >
            {buttonText}
          </Link>
        </Pagination.Item>
      );
    // Control buttons
    let newParams = searchParams;
    if (buttonText == "‹") newParams.set("page", page - 1);
    else if (buttonText == "›") newParams.set("page", page + 1);
    else if (buttonText == "«") newParams.set("page", 1);
    else if (buttonText == "»") newParams.set("page", pageMax);
    else newParams.set("page", buttonText);
    return (
      <Pagination.Item>
        <Link
          to={"/myrecipes?" + newParams.toString()}
          className="no-style-link"
        >
          {buttonText}
        </Link>
      </Pagination.Item>
    );
  }

  // Returns a list of buttons for the Pagination component
  function genearatePagination() {
    let buttonList = [];
    // "Previous" and "first" buttons
    buttonList.push("«");
    buttonList.push("‹");
    console.log("pageMax", pageMax);
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
        for (let i = page; i <= getPageMaxNumber(data.recipies); i++)
          buttonList.push(i);
      }
    }
    // "Next" and "last" buttons
    buttonList.push("›");
    buttonList.push("»");
    // Generating actual buttons from the list
    console.log("buttonList", buttonList);
    return buttonList.map((item) => generatePageButton(item));
  }

  return (
    <PageWrapper showSearchBar="false" showGlobalRecipeSearch="true">
      {/* =========== Recipe tiles =========== */}
      <section className="d-flex mb-4 recipe-suggestion-section">
        <Container fluid>
          <Row className="row-gap-4 pb-4">
            <Col className="col-lg-3 col-md-4 col-sm-6 col-12">
              <Link className="no-style-link" to="/editor">
                <div
                  className="h-100 bg-secondary-subtle d-flex justify-content-center align-items-center"
                  style={{ border: "dashed"}}
                >
                  <img src={icons.plus} width={75} height={75}/>
                </div>
              </Link>
            </Col>
            {getPageData(data.recipies, page).map((item) => (
              <RecipeTile {...item} key={item.id} />
            ))}
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
