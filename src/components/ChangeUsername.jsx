import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { authInfo, authLogin } from "../services/authUtils.jsx";
import Data from "../services/Data.jsx";

export default function () {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();
  const [recipesCreated, setRecipesCreated] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    feedback:
      "Please enter a valid username (alphanumeric characters and underscores only).",
  });
  const [isInvalid] = useState({
    username: false,
  });

  const regex = /^[a-zA-Z0-9_]+$/;

  function feedback() {
    if (formData.username == "" || !regex.test(formData.username)) {
      return "Please enter a valid username (alphanumeric characters and underscores only).";
    }
    return "Username is already taken.";
  }

  function usernameIsNotUnique() {
    for (const user of users) {
      if (user.username == formData.username) {
        return true;
      }
    }
    return false;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    isInvalid.username =
      usernameIsNotUnique() || !regex.test(formData.username);

    formData.feedback = feedback();

    handleChange(event);

    if (isInvalid.username) {
      event.stopPropagation();
    } else {
      updateRecipeAuthor();
      updateUsername();
      authLogin({ login: formData.username, ignoreServer: true });
      handleShow();
    }

    event.preventDefault();
  };

  const updateRecipeAuthor = async () => {
    try {
      recipesCreated.forEach((item) => {
        const data = {
          username: formData.username,
        };

        Data.put("Recipes/update/" + item, data);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateUsername = async () => {
    try {
      const data = {
        username: formData.username,
      };

      Data.put("Users/update/" + userId, data);
    } catch (err) {
      console.error(err);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    Data.get("Users").then((response) => {
      setUsers(response);
    });
    Data.get("Users/" + authInfo()).then((response) => {
      setUserId(response.userId);
      setRecipesCreated(response.recipesCreated);
    });
  }, []);

  return (
    <Form className="mt-4 ms-3" onSubmit={handleSubmit}>
      <Form.Label>
        <h4>Change Username</h4>
      </Form.Label>
      <Form.Group className="mb-3">
        <Form.Label>New Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          maxLength={30}
          onChange={handleChange}
          isInvalid={isInvalid.username}
        />
        <Form.Control.Feedback type="invalid">
          {formData.feedback}
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="primary">
        Update
      </Button>
      {/** Modal for after successfully changing username */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Username successfully changed.</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}
