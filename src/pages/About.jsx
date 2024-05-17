import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Container } from "react-bootstrap";

export default function About() {
  return (
    <PageWrapper>
      <title>About Us</title>
      <Container className="content-section-wrapper">
        {/*Logo*/}
        <section className="logo-search-section d-flex flex-column align-items-center gap-4 py-4">
          <div className="logo-search-section__img-wrapper overflow-hidden">
            <img src="https://placehold.co/200" />
          </div>
        </section>
        {/*about*/}
        <section>
          <div className="about">
            <h1>About Us</h1>
            <p>
              "One cannot think well, love well, sleep well, if one has not
              dined well.”<br></br>– Virginia Woolf
            </p>
          </div>
          {/*story*/}
          <div className="story_contain">
            <section className="story_contain__story">
              <div class="story_contain__img">
                <img src="https://placehold.co/400" />
              </div>
              <div class="story_contain__content">
                <h2>Our Story</h2>
                <p>
                  This website will allow users to create, read, update, and
                  delete culinary recipes, as well as rate and share recipes
                  within a designated user base. Customizable tags and filters
                  will be available to users to empower intuitive searching,
                  sorting, and bookmarking mechanisms. Gone are the days where
                  planning to make a recipe mandates a trip to the grocery. With
                  PlumPantry, users will be able to quickly discover recipes
                  containing the ingredients they have on hand.{" "}
                </p>
              </div>
            </section>
          </div>
          {/*mission*/}
          <section className="mission">
            <div class="mission__content">
              <h2>Our Mission</h2>
              <p>
                The Purple Plums, a development team made up of DePaul
                University students, has been asked to develop a novel CRUD
                program in the form of a recipe sharing website. This project
                will be evaluated by a potential future partner who will assess
                our plan, design, development, and implementation strategy.{" "}
              </p>
            </div>
          </section>
          {/*team*/}
          <section className="team">
            <div class="team__img">
              <h2>Meet Our Team</h2>
            </div>
            <div class="team__content">
              <img src="https://placehold.co/400" />
            </div>
          </section>
        </section>
      </Container>
    </PageWrapper>
  );
}
