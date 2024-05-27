import PageWrapper from "./../components/PageWrapper.jsx";
import { Container } from "react-bootstrap";
import storylogo from "./../assets/logo/logo-circle-medium.webp";
import aboutPic from "./../assets/ai_foodPlate.jpg";

export default function About() {
  return (
    <PageWrapper>
      <title>About Us</title>
      <Container className="content-section-wrapper">
        {/*Logo*/}
        <section>
          <div className="about_contain">
            <img src={aboutPic} className="about_contain__image" />
            <div className="about_contain__words"></div>
          </div>
        </section>
        {/*about*/}
        <section>
          <div className="about">
            <p>
              "One cannot think well, love well, sleep well, if one has not
              dined well.”<br></br>– Virginia Woolf
            </p>
          </div>
          {/*story*/}
          <div className="story_contain">
            <section className="story_contain__story">
              <div class="story_contain__img">
                <img src={storylogo} />
              </div>
              <div class="story_contain__content">
                <h2>Our Story </h2>
                <p>
                  Picture a website where creating, discovering, and sharing
                  recipes is easy and seamless. No more dusty cookbooks or
                  frantic searches for ingredients. With PlumPantry explore
                  diverse cuisines, find recipes tailored to your pantry, and
                  craft your masterpieces. Join our community of food lovers
                  where you can rate recipes and inspire one another. Welcome to
                  PlumPantry, where cooking becomes an art and every dish a
                  masterpiece. Let's create, explore, and savor together your
                  culinary adventure starts here!
                </p>
              </div>
            </section>
          </div>
          {/*mission*/}
          <section className="mission">
            <div class="mission__content">
              <h2>Our Mission</h2>
              <p>
                Our mission as The Purple Plums, a development team made up of
                DePaul University students, is to develop a novel CRUD program.
                In which we succeeded in the form of a recipe sharing website.
                The Purple Plums website is crafted to be a seamless platform
                for creating, discovering, and sharing recipes. We aim to
                revolutionize the way people interact with recipes, making every
                cooking experience effortless, enjoyable, and inspiring.
              </p>
            </div>
          </section>
        </section>
      </Container>
    </PageWrapper>
  );
}
