import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Container, Form, Modal, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authLogin } from "../utils/auth.jsx";

export default function Login() {
  //Handle Validation
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    //display login info
    else {
      alert(
        `Email: ${loginData.email}
      Password: ${loginData.password}`
      );
    }
    setValidated(true);

    if (form.checkValidity() === true) {
      authLogin(loginData.email);
      navigate("/");
    }
  };

  //Holds all login info
  //To gather data is within the Form.Control from onInput
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  return (
    <PageWrapper showBackground="false">
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <Card className="text-center w-300" border="dark">
          <Card.Body>
            <Card.Title>
              <h2>Account Login</h2>
            </Card.Title>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-2">
                <Form.Control
                  required
                  type="text"
                  placeholder="Login or e-mail"
                  maxLength={30}
                  onInput={(event) =>
                    setLoginData({
                      ...loginData,
                      email: event.target.value,
                    })
                  }
                />
              </Form.Group>
              {/* password */}
              <Form.Group className="mb-2">
                <Form.Control
                  required
                  type="password"
                  id="inputPassword5"
                  placeholder="Password"
                  maxLength={100}
                  onInput={(event) =>
                    setLoginData({
                      ...loginData,
                      password: event.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Login
                  </Button>
                </div>
              </Form.Group>
              {/* Reset Password Link */}
              <Card.Text>
                <Link to="/forgot">Forgot your password?</Link>
              </Card.Text>
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
