import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Form, Image, InputGroup, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authRegister } from "../services/authUtils.jsx";
import Data from "../services/Data.jsx";
import icons from "./../icon-data.js";

export default function Register() {
  //Handle Validation
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  function handleToggle() {
    setShowPassword(!showPassword.valueOf());
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function usernameFeedback() {
    if (
      registerData.username == "" ||
      !usernameRegex.test(registerData.username)
    ) {
      return "Please enter a valid username (alphanumeric characters and underscores only).";
    }
    return "Username is already taken.";
  }

  function emailFeedback() {
    if (registerData.email == "" || !emailRegex.test(registerData.email)) {
      return "Please enter a valid email address.";
    }
    return "This email is already in use.";
  }

  function usernameIsNotUnique() {
    for (const user of users) {
      if (user.username == registerData.username) {
        return true;
      }
    }
    return false;
  }

  function emailIsNotUnique() {
    for (const user of users) {
      if (user.email == registerData.email) {
        return true;
      }
    }
    return false;
  }

  //Holds all register info
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Data for invalidation
  const [isInvalid] = useState({
    username: false,
    email: false,
    password: false,
    checkbox: false,
  });

  const [feedback] = useState({
    username: "",
    email: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckbox = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = (event) => {
    isInvalid.username =
      usernameIsNotUnique() || !usernameRegex.test(registerData.username);
    isInvalid.email =
      emailIsNotUnique() || !emailRegex.test(registerData.email);
    isInvalid.password = registerData.password.length < 6;
    isInvalid.checkbox = !isChecked.valueOf();

    feedback.username = usernameFeedback();
    feedback.email = emailFeedback();

    handleChange(event);

    if (
      isInvalid.username ||
      isInvalid.email ||
      isInvalid.password ||
      isInvalid.checkbox
    ) {
      event.stopPropagation();
    } else {
      authRegister({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      }).then((response) => {
        console.log("REGISTRATION MESSAGE", response);
        // Successful registration
        if (response.username) navigate("/");
        // Failed registration
        else alert(response.errMessage);
      });
    }

    event.preventDefault();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    Data.get("Users").then((response) => {
      setUsers(response);
    });
  }, []);

  return (
    <PageWrapper showBackground="false">
      <div className="d-flex h-100 justify-content-center align-items-center pb-5">
        <Card className="text-center w-300 col-md-3" border="dark">
          <Card.Body>
            <Card.Title>
              <h2>Registration</h2>
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              {/* Username */}
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={registerData.username}
                  maxLength={30}
                  onChange={handleChange}
                  isInvalid={isInvalid.username}
                />
                <Form.Control.Feedback type="invalid">
                  {feedback.username}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Email */}
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={registerData.email}
                  maxLength={30}
                  onChange={handleChange}
                  isInvalid={isInvalid.email}
                />
                <Form.Control.Feedback type="invalid">
                  {feedback.email}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Password */}
              <InputGroup className="mb-2">
                <Form.Control
                  type={showPassword.valueOf() ? "text" : "password"}
                  id="inputPassword5"
                  placeholder="Password"
                  name="password"
                  value={registerData.password}
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
                  Password must be at least 6 characters long.
                </Form.Control.Feedback>
              </InputGroup>
              {/* Terms & Conditions */}
              <Form.Group className="mb-4">
                <div className="d-flex gap-2">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span>
                        I agree to the{" "}
                        <Link onClick={handleShow}>Terms and Conditions</Link>.
                      </span>
                    }
                    onChange={handleCheckbox}
                    checked={isChecked}
                    feedback="You must agree before signing up."
                    feedbackType="invalid"
                    isInvalid={isInvalid.checkbox}
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
        <Modal.Body>
          <p>
            05-25-2024 Terms and Conditions: This site collects and stores some
            information for users such as email, password, and personal recipes.
            By registering as a user, you are agreeing to allow PlumPantry to
            store the aforementioned data for educational purposes only. Your
            data will not be shared with third parties, nor will it be misused
            by PlumPantry owners/operators. PlumPantry will ensure that any data
            you provide is reasonably secured, however we ask that you do not
            store sensitive information like real credentials used for other
            websites.
          </p>

          <p>
            Code of Conduct: Users of PlumPantry shall not post offensive or
            obscene materials on the public site. Violators of the code of
            conduct will be reasonably reprimanded up to account removal.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </PageWrapper>
  );
}
