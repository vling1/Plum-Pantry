import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function () {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form
      className="mt-4 ms-3"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Label>
        <h4>Change Username</h4>
      </Form.Label>
      <Form.Group className="mb-3">
        <Form.Label>New Username</Form.Label>
        <Form.Control
          required
          type="text"
          pattern="^[a-zA-Z0-9]+$"
          maxLength={30}
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid username (alphanumeric characters only).
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="primary">
        Update
      </Button>
    </Form>
  );
}
