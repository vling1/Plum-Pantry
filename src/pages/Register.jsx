import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Container, Form, Modal, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authLogin } from "../utils/auth.jsx";

export default function Register() {
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

    //display register info
    else {
      alert(
        `Username: ${registerData.username}
        Email: ${registerData.email}
        Password: ${registerData.password}`
      );
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      authLogin(registerData.username);
      navigate("/");
    }
  };

  //Holds all register info
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <PageWrapper showBackground="false">
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <Card className="text-center w-300 col-md-3" border="dark">
          <Card.Body>
            <Card.Title>
              <h2>Registration</h2>
            </Card.Title>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Username */}
              <Form.Group className="mb-2">
                <Form.Control
                  required
                  type="text"
                  placeholder="Username"
                  pattern="^[a-zA-Z0-9]+$"
                  maxLength={30}
                  onInput={(event) =>
                    setRegisterData({
                      ...registerData,
                      username: event.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid username (alphanumeric characters only).
                </Form.Control.Feedback>
              </Form.Group>
              {/* Email */}
              <Form.Group className="mb-2">
                <Form.Control
                  required
                  type="email"
                  placeholder="Email"
                  maxLength={30}
                  onInput={(event) =>
                    setRegisterData({
                      ...registerData,
                      email: event.target.value,
                    })
                  }
                />
              </Form.Group>
              {/* Password */}
              <Form.Group className="mb-2">
                <Form.Control
                  required
                  type="password"
                  id="inputPassword5"
                  placeholder="Password"
                  minLength={6}
                  maxLength={100}
                  onInput={(event) =>
                    setRegisterData({
                      ...registerData,
                      password: event.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Password must be at least 6 characters long.
                </Form.Control.Feedback>
              </Form.Group>
              {/* Terms & Conditions */}
              <Form.Group className="mb-4">
                <div className="d-flex gap-2">
                  <Form.Check
                    required
                    type="checkbox"
                    label={
                      <span>
                        I agree to the{" "}
                        <Link onClick={handleShow}>Terms and Conditions</Link>.
                      </span>
                    }
                    feedback="You must agree before signing up."
                    feedbackType="invalid"
                  />
                </div>
              </Form.Group>
              {/* Submit button */}
              <Form.Group className="mb-4">
                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Sign Up
                  </Button>
                </div>
              </Form.Group>
              {/** Sign up */}
              <Card.Text>
                Already have an account? <Link to="/login">Sign In</Link>
              </Card.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
      {/** Modal for displaying terms and conditions */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>Insert terms and conditions here.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </PageWrapper>
  );
}
