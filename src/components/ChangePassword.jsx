import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { authInfo } from "../services/authUtils";
import Data from "../services/Data";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentPasswordFeedback: "Password must be at least 6 characters long.",
    newPasswordFeedback: "Password must be at least 6 characters long",
  });
  const [isInvalid] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  function currentPasswordFeedback() {
    if (formData.currentPassword.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "Incorrect password.";
  }

  function newPasswordFeedback() {
    if (formData.newPassword.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "New password is the same as the current password.";
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    isInvalid.currentPassword = formData.currentPassword != password;
    isInvalid.newPassword =
      formData.newPassword.length < 6 ||
      formData.currentPassword == formData.newPassword;
    isInvalid.confirmPassword =
      formData.newPassword != formData.confirmPassword;

    formData.currentPasswordFeedback = currentPasswordFeedback();
    formData.newPasswordFeedback = newPasswordFeedback();

    handleChange(event);

    if (
      isInvalid.currentPassword ||
      isInvalid.newPassword ||
      isInvalid.confirmPassword
    ) {
      event.stopPropagation();
    } else {
      updatePassword();
      handleShow();
    }

    event.preventDefault();
  };

  const updatePassword = async () => {
    try {
      const data = {
        password: formData.confirmPassword,
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
    Data.get("Users/" + authInfo()).then((response) => {
      setPassword(response.password);
      setUserId(response.userId);
    });
  }, []);

  return (
    <Form className="mt-4 ms-3" onSubmit={handleSubmit}>
      <Form.Label>
        <h4>Change Password</h4>
      </Form.Label>
      <Form.Group className="mb-2">
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          isInvalid={isInvalid.currentPassword}
        />
        <Form.Control.Feedback type="invalid">
          {formData.currentPasswordFeedback}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          isInvalid={isInvalid.newPassword}
        />
        <Form.Control.Feedback type="invalid">
          {formData.newPasswordFeedback}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          isInvalid={isInvalid.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          Passwords do not match.
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="primary">
        Update
      </Button>
      {/** Modal for after successfully changing password */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Password successfully changed.</Modal.Title>
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
