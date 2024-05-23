import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import headerLogo from "./../assets/logo/logo-small.webp";
import Dropdown from "react-bootstrap/Dropdown";
import { authInfo, authLogout } from "../services/authUtils.jsx";
import { useState } from "react";

export default function Header({ showSearchBar = "true" }) {
  const [username, setUsername] = useState(authInfo());
  return (
    <Navbar expand="lg" className="sticky-top navigation-bar px-3 py-2">
      <Navbar.Brand className="pe-3">
        <Link to="/">
          <div className="navigation-bar__logo-wrapper">
            <img src={headerLogo} />
          </div>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="d-flex gap-3 basic-navbar-nav">
        {/* Links */}
        <Nav className="w-100 flex-row gap-4 nagivation-bar__left-buttons align-items-center py-2">
          <Link className="no-style-link" to="/">
            Home
          </Link>
          <Link className="no-style-link" to="/recipes">
            Recipes
          </Link>
          <Link className="no-style-link" to="/about">
            About
          </Link>
        </Nav>
        {/* Search Bar */}
        {showSearchBar == "true" ? (
          <Form className="d-flex navigation-bar__search-bar">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-1"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        ) : (
          <></>
        )}

        {/* Condition if logged in or not */}
        {username != null ? (
          // Logged In
          <Nav className="flex-row gap-1 mt-2 mt-lg-0 ms-0 ms-lg-4 nagivation-bar__right-buttons">
            <Dropdown>
              <Dropdown.Toggle>{username}</Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: "120px" }} align={{lg: 'end'}}>
                <Dropdown.Item>
                  <Link className="no-style-link" to="/settings">
                    Settings
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link className="no-style-link" to="/myrecipes">
                    My Recipes
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => window.location.reload()}>
                  <Link className="no-style-link" to="/editor">
                    New Recipe
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    authLogout();
                    setUsername(null);
                    window.location.reload();
                  }}
                >
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        ) : (
          // Not Logged In
          <Nav className="flex-row gap-1 mt-2 mt-lg-0 ms-0 ms-lg-4 nagivation-bar__right-buttons">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
