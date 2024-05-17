import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Container } from "react-bootstrap";
import GlobalRecipeSearch from "./GlobalRecipeSearch.jsx";

export default function PageWrapper({
  children,
  showBackground = "true",
  showSearchBar = "true",
  showGlobalRecipeSearch = "false",
}) {
  return (
    <div className="page-wrapper">
      <Header showSearchBar={showSearchBar} />
      {showGlobalRecipeSearch == "true" ? <GlobalRecipeSearch /> : null}
      <Container
        fluid="xxl"
        className={
          "pt-4 pb-4 " +
          (showBackground == "true" ? "content-section-wrapper" : "")
        }
      >
        {children}
      </Container>
      <Footer />
    </div>
  );
}
