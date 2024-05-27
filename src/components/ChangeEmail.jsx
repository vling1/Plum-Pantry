import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { authInfo } from "../services/authUtils";
import Data from "../services/Data";

export default function ChangeEmail() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    feedback: "Please enter a valid email address.",
  });
  const [isInvalid] = useState({
    email: false,
  });

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function feedback() {
    if (formData.email == "" || !regex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    return "This email is already in use.";
  }

  function emailIsNotUnique() {
    for (const user of users) {
      if (user.email == formData.email) {
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
    isInvalid.email = emailIsNotUnique() || !regex.test(formData.email);

    formData.feedback = feedback();

    handleChange(event);

    if (isInvalid.email) {
      event.stopPropagation();
    } else {
      updateEmail();
      handleShow();
    }

    event.preventDefault();
  };

  const updateEmail = async () => {
    try {
      const data = {
        email: formData.email,
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
    });
  }, []);

  return (
    <Form className="mt-4 ms-3" onSubmit={handleSubmit}>
      <Form.Label>
        <h4>Change Email</h4>
      </Form.Label>
      <Form.Group className="mb-3">
        <Form.Label>New Email</Form.Label>
        <Form.Control
          type="text"
          name="email"
          value={formData.email}
          maxLength={50}
          onChange={handleChange}
          isInvalid={isInvalid.email}
        />
        <Form.Control.Feedback type="invalid">
          {formData.feedback}
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="primary">
        Update
      </Button>
      {/** Modal for after successfully changing email */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Email successfully changed.</Modal.Title>
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
