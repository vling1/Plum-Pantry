import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function ChangeEmail() {
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
        <h4>Change Email</h4>
      </Form.Label>
      <Form.Group className="mb-3">
        <Form.Label>New Email</Form.Label>
        <Form.Control required type="email" />
      </Form.Group>
      <Button type="submit" variant="primary">
        Update
      </Button>
    </Form>
  );
}
