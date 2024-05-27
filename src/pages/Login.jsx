import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Form, Image, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { authLogin } from "../services/authUtils.jsx";
import icons from "./../icon-data.js";

export default function Login() {
  //Handle Validation
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  function handleToggle() {
    setShowPassword(!showPassword.valueOf());
  }

  //Holds all login info
  //To gather data is within the Form.Control from onInput
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const [isInvalid] = useState({
    login: false,
    password: false,
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    authLogin({ login: loginData.login, password: loginData.password }).then(
      (response) => {
        // Successful login
        if (response) {
          isInvalid.login = false;
          isInvalid.password = false;
          navigate("/");
        }
        // Failed login
        else {
          isInvalid.login = true;
          isInvalid.password = true;
          
        }
        handleChange(event);
      }
    );

    event.preventDefault();
  };

  return (
    <PageWrapper showBackground="false">
      <div className="d-flex h-100 justify-content-center align-items-center pb-5">
        <Card className="text-center w-300" border="dark">
          <Card.Body>
            <Card.Title>
              <h2>Account Login</h2>
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              {/* Username/Email */}
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Username or Email"
                  name="login"
                  value={loginData.login}
                  maxLength={30}
                  onChange={handleChange}
                  isInvalid={isInvalid.login}
                />
              </Form.Group>
              {/* Password */}
              <InputGroup className="mb-2">
                <Form.Control
                  type={showPassword.valueOf() ? "text" : "password"}
                  id="inputPassword5"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  maxLength={100}
                  onChange={handleChange}
                  isInvalid={isInvalid.password}
                />
                <Button onClick={handleToggle} variant="outline-light">
                  <Image
                    src={showPassword.valueOf() ? icons.eye : icons.eyeSlash}
                    height={20}
                    width={20}
                  />
                </Button>
                <Form.Control.Feedback type="invalid">
                  Incorrect username/email or password.
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Group className="mb-4 flex">
                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Login
                  </Button>
                </div>
              </Form.Group>
              {/* Sign up */}
              <Card.Text>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </Card.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </PageWrapper>
  );
}
