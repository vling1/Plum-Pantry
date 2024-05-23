import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Container } from "react-bootstrap";
import GlobalRecipeSearch from "./GlobalRecipeSearch.jsx";
import { useState } from "react";
import { useEffect } from "react";

export default function PageWrapper({
  children,
  showBackground = "true",
  showSearchBar = "true",
  showGlobalRecipeSearch = "false",
  searchQueryHook,
  tagQueryHook,
  sortModeHook,
}) {
  return (
    <div className="page-wrapper">
      <div className="page-wrapper__100vh d-flex flex-column">
        <Header showSearchBar={showSearchBar} />
        {/* Global search display */}
        {showGlobalRecipeSearch == "true" ? (
          <GlobalRecipeSearch
            // Sending hooks to connect Recipes and GlobalRecipeSearch
            searchQueryHook={searchQueryHook}
            tagQueryHook={tagQueryHook}
            sortModeHook={sortModeHook}
          />
        ) : null}
        <div className="flex-grow-1 d-flex justify-content-center h-100 m-0 p-0">
          <Container
            fluid="xxl"
            className={
              "m-0 page-wrapper__container " +
              (showBackground == "true" ? "content-section-wrapper" : "")
            }
          >
            {children}
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
}
