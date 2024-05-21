import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Form, Tab, Tabs } from "react-bootstrap";
import ChangeUsername from "../components/ChangeUsername.jsx";
import ChangeEmail from "../components/ChangeEmail.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.jsx";

export default function UserSettings() {
  const navigate = useNavigate();

  // Check if user is logged in, if not redirect to login page
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/error404");
    }
  }, []);

  return (
    <PageWrapper>
      <Tabs defaultActiveKey="general">
        {/* General tab */}
        <Tab eventKey="general" title="General" className="max-w-500">
          <ChangeUsername />
          <ChangeEmail />
          <ChangePassword />
        </Tab>

        {/* Preferences tab */}
        <Tab eventKey={"preferences"} title="Preferences" className="max-w-500">
          <div className="mt-4 ms-3 me-3 mb-4">
            <h4>Tag Blacklist</h4>
            <p>
              You can select any number of tags that will be excluded from the
              search by default. For instance, you may select tags that you are
              allergic to.
            </p>
            <Card border="dark">
              <Card.Body>
                <Form className="d-flex navigation-bar__search-bar">
                  <Form.Control
                    type="search"
                    placeholder="Search for tags you want to exclude"
                    className="me-1"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Card.Body>
            </Card>
            <Form className="mt-5">
              <Form.Label>
                <h4>Dietary Preferences</h4>
              </Form.Label>
              <Form.Check
                className="mb-3"
                type="checkbox"
                label="Search only for vegan ingredients"
              />
              <Form.Check
                className="mb-3"
                type="checkbox"
                label="Search only for kosher ingredients"
              />
              <Form.Check
                className="mb-3"
                type="checkbox"
                label="Search only for halal ingredients"
              />
            </Form>
          </div>
        </Tab>
      </Tabs>
    </PageWrapper>
  );
}
