import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Container } from "react-bootstrap";

// Requesting any non-existent page leads the user here

export default function UserSettings() {
  return (
    <PageWrapper>
      <div>
        <h1 style={{ textAlign: "center" }}>Error 404</h1>
      </div>
      <div className="error">
        {/* Content */}
        <div className="errorContent">
          <h1>
            NO MISTAKES. <br></br>
            JUST HAPPY ACCIDENTS
          </h1>
          <p>
            Congrats, you found our 404 page! <br></br>
            Unfortunately, the page you were looking for <br></br>
            is not looking for you.
          </p>
          <Button href="/" variant="info">
            Take me to PlumPantry
          </Button>
        </div>
      </div>
      {/* Meme? | Optional */}
      {/* <img src="https://placehold.co/400" /> */}
    </PageWrapper>
  );
}
