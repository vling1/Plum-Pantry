import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function ChangePassword() {
  const [validated, setValidated] = useState(false);

  const [form_Data, set_Form_Data] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    set_Form_Data({
      ...form_Data,
      [name]: value,
    });
  };

  return (
    <Form
      className="mt-4 ms-3"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Label>
        <h4>Change Password</h4>
      </Form.Label>
      <Form.Group className="mb-2">
        <Form.Label>Current Password</Form.Label>
        <Form.Control required type="password" />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          required
          type="password"
          name="newPassword"
          value={form_Data.newPassword}
          onChange={handleChange}
          minLength={6}
          isInvalid={validated && form_Data.newPassword < 6}
        />
        <Form.Control.Feedback type="invalid">
          Password must be at least 6 characters long.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          required
          type="password"
          name="confirmPassword"
          value={form_Data.confirmPassword}
          onChange={handleChange}
          minLength={6}
          pattern={form_Data.newPassword}
          isInvalid={
            validated && form_Data.confirmPassword !== form_Data.newPassword
          }
        />
        <Form.Control.Feedback type="invalid">
          Passwords do not match.
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="primary">
        Update
      </Button>
    </Form>
  );
}
